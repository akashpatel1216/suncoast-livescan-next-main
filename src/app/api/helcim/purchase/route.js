export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'USD',
      description,
      cardToken,
      customer,
      metadata
    } = body || {};

    if (!amount || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Expected numeric amount in dollars.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!cardToken) {
      return new Response(
        JSON.stringify({ error: 'Missing cardToken' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const helcimApiToken = process.env.HELCIM_API_TOKEN;
    const helcimEnvironment = process.env.HELCIM_ENV || 'sandbox'; // 'sandbox' | 'production'

    if (!helcimApiToken) {
      return new Response(
        JSON.stringify({ error: 'Server not configured: missing HELCIM_API_TOKEN' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = `https://api.${helcimEnvironment === 'production' ? '' : 'sandbox.'}helcim.com/v2`;
    const endpoint = `${baseUrl}/payments/purchase`;

    // Build payload according to Helcim Payments API (fields may vary by account configuration)
    const purchasePayload = {
      amount,
      currency,
      description,
      cardToken,
      // Optional: pass through customer details and any metadata
      customer,
      metadata,
    };

    const helcimResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${helcimApiToken}`,
      },
      body: JSON.stringify(purchasePayload),
    });

    const helcimJson = await helcimResponse.json().catch(() => ({}));

    if (!helcimResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Helcim purchase failed', details: helcimJson }),
        { status: helcimResponse.status || 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Normalize a success response
    return new Response(
      JSON.stringify({ success: true, helcim: helcimJson }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unexpected server error', details: String(error?.message || error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
