import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      appointmentId,
      transactionId,
      startISO,
      endISO,
      serviceName,
      oriCode,
      customer, // { firstName, lastName, email, phone }
      notes,
    } = body || {};

    // If an existing appointment is provided, mark paid and confirm associated slot if present
    if (appointmentId) {
      const { data: appt, error: getErr } = await supabaseAdmin
        .from('upcoming_appointments')
        .select('id, booked_slot_id')
        .eq('id', appointmentId)
        .single();
      if (getErr || !appt) return NextResponse.json({ error: getErr?.message || 'Appointment not found' }, { status: 404 });

      const { error: updApptErr } = await supabaseAdmin
        .from('upcoming_appointments')
        .update({ payment_done: true, notes: transactionId ? `Txn: ${transactionId}` : notes || null })
        .eq('id', appointmentId);
      if (updApptErr) return NextResponse.json({ error: updApptErr.message }, { status: 500 });

      if (appt.booked_slot_id) {
        const { error: updSlotErr } = await supabaseAdmin
          .from('booked_slots')
          .update({ status: 'confirmed' })
          .eq('id', appt.booked_slot_id);
        if (updSlotErr) return NextResponse.json({ error: updSlotErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Otherwise, create everything now (no pre-hold): customer, booked slot confirmed, upcoming appointment marked paid
    if (!startISO || !endISO || !customer?.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert customer by email
    const { data: existingCustomer, error: findErr } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .maybeSingle();
    if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 });

    let customerId = existingCustomer?.id;
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
      if (insCustErr) return NextResponse.json({ error: insCustErr.message }, { status: 500 });
      customerId = insertedCustomer.id;
    }

    // Insert confirmed booked slot now
    const { data: bookedSlot, error: slotErr } = await supabaseAdmin
      .from('booked_slots')
      .insert({
        start_at: new Date(startISO).toISOString(),
        end_at: new Date(endISO).toISOString(),
        ori_code: oriCode || null,
        status: 'confirmed',
      })
      .select('id')
      .single();
    if (slotErr) {
      const status = String(slotErr.code || '').startsWith('23') ? 409 : 500;
      return NextResponse.json({ error: slotErr.message }, { status });
    }

    // Create paid upcoming appointment
    const { error: apptErr } = await supabaseAdmin
      .from('upcoming_appointments')
      .insert({
        booked_slot_id: bookedSlot.id,
        customer_id: customerId,
        service_name: serviceName || null,
        ori_code: oriCode || null,
        payment_done: true,
        notes: transactionId ? `Txn: ${transactionId}` : notes || null,
      });
    if (apptErr) return NextResponse.json({ error: apptErr.message }, { status: 500 });

    return NextResponse.json({ success: true, bookedSlotId: bookedSlot.id });
  } catch (error) {
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'POST to confirm appointment after payment.' });
}


