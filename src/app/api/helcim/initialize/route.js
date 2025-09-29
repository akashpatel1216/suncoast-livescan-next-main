import { NextResponse } from 'next/server';

const HELCIM_INITIALIZE_URL = 'https://api.helcim.com/v2/helcim-pay/initialize';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const apiToken = process.env.HELCIM_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'Missing HELCIM_API_TOKEN on server' }, { status: 500 });
    }

    // Send exactly these fields only
        const payload = {
      paymentType: body.paymentType,
          amount: body.amount,
      currency: body.currency,
    };
    
    // Add optional fields if provided
    if (body.confirmationScreen !== undefined) {
      payload.confirmationScreen = body.confirmationScreen;
    }

    const res = await fetch(HELCIM_INITIALIZE_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-token': apiToken,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'POST to initialize a Helcim payment session.' });
}


