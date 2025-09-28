import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json().catch(() => ({}));
    const {
      startISO,
      endISO,
      serviceName,
      oriCode,
      customer, // { firstName, lastName, email, phone }
      notes,
    } = body || {};

    if (!startISO || !endISO) {
      return NextResponse.json({ error: 'Missing required start/end' }, { status: 400 });
    }

    // If customer email provided, upsert customer and create upcoming_appointment below.
    let customerId = null;
    if (customer?.email) {
      const { data: existingCustomer, error: findErr } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .maybeSingle();
      if (findErr) {
        return NextResponse.json({ error: findErr.message }, { status: 500 });
      }
      customerId = existingCustomer?.id || null;
      if (!customerId) {
        const { data: insertedCustomer, error: insCustErr } = await supabaseAdmin
          .from('customers')
          .insert({
            first_name: customer.firstName || null,
            last_name: customer.lastName || null,
            email: customer.email,
            phone: customer.phone || null,
          })
          .select('id')
          .single();
        if (insCustErr) {
          return NextResponse.json({ error: insCustErr.message }, { status: 500 });
        }
        customerId = insertedCustomer.id;
      }
    }

    // Create booked slot as held
    const { data: bookedSlot, error: slotErr } = await supabaseAdmin
      .from('booked_slots')
      .insert({
        start_at: new Date(startISO).toISOString(),
        end_at: new Date(endISO).toISOString(),
        ori_code: oriCode || null,
        status: 'held',
      })
      .select('id, start_at, end_at, status')
      .single();

    if (slotErr) {
      // Overlap/constraint errors should be treated as conflict
      const status = String(slotErr.code || '').startsWith('23') ? 409 : 500;
      return NextResponse.json({ error: slotErr.message }, { status });
    }

    // Optionally create upcoming_appointment only if we have a customerId
    if (customerId) {
      const { data: appt, error: apptErr } = await supabaseAdmin
        .from('upcoming_appointments')
        .insert({
          booked_slot_id: bookedSlot.id,
          customer_id: customerId,
          service_name: serviceName || null,
          ori_code: oriCode || null,
          payment_done: false,
          notes: notes || null,
        })
        .select('id, payment_done')
        .single();

      if (apptErr) {
        // Roll back the slot if appointment insert fails
        await supabaseAdmin.from('booked_slots').delete().eq('id', bookedSlot.id);
        return NextResponse.json({ error: apptErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        bookedSlotId: bookedSlot.id,
        appointmentId: appt.id,
      }, { status: 201 });
    }

    // Hold-only response
    return NextResponse.json({ success: true, bookedSlotId: bookedSlot.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'POST to create an appointment hold.' });
}


