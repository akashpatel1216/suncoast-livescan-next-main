import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json().catch(() => ({}));
    const { bookedSlotId, appointmentId } = body || {};
    if (!bookedSlotId && !appointmentId) {
      return NextResponse.json({ error: 'Provide bookedSlotId or appointmentId' }, { status: 400 });
    }

    let targetSlotId = bookedSlotId;
    if (!targetSlotId && appointmentId) {
      const { data: appt, error: getErr } = await supabaseAdmin
        .from('upcoming_appointments')
        .select('booked_slot_id')
        .eq('id', appointmentId)
        .single();
      if (getErr || !appt) return NextResponse.json({ error: getErr?.message || 'Appointment not found' }, { status: 404 });
      targetSlotId = appt.booked_slot_id;
    }

    // Delete appointment if provided
    if (appointmentId) {
      await supabaseAdmin.from('upcoming_appointments').delete().eq('id', appointmentId);
    }

    if (targetSlotId) {
      await supabaseAdmin.from('booked_slots').delete().eq('id', targetSlotId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'POST to cancel a held appointment.' });
}


