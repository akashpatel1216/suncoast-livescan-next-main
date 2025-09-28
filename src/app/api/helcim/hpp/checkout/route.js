import crypto from 'crypto';

function formatAmount(amount) {
  const n = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (!Number.isFinite(n)) throw new Error('Invalid amount');
  return n.toFixed(2);
}

function hashAmount(secretKey, value) {
  return crypto.createHash('sha256').update(`${value}${secretKey}`).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, sku = 'SERVICE', description = 'Fingerprinting Service', quantity = 1, bookingId } = body || {};

    const token = process.env.HELCIM_HPP_TOKEN;
    const secret = process.env.HELCIM_HPP_SECRET_KEY;
    const hashMode = (process.env.HELCIM_HPP_HASH_MODE || 'amount').toLowerCase(); // 'amount' | 'item' | 'none'

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Server not configured for HPP: missing HELCIM_HPP_TOKEN' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const amt = formatAmount(amount);
    const price = amt; // single line item equals total amount

    const baseUrl = 'https://arcpoint-labs-of-north-tampa.myhelcim.com/hosted/';

    // Build GET url (for backwards compatibility)
    const urlParams = new URLSearchParams();
    urlParams.set('token', token);
    urlParams.set('itemSKU1', String(sku));
    urlParams.set('itemDescription1', String(description));
    urlParams.set('itemQuantity1', String(quantity));
    urlParams.set('itemPrice1', String(price));
    if (hashMode === 'amount' && secret) {
      urlParams.set('amountHash', hashAmount(secret, amt));
    } else if (hashMode === 'item' && secret) {
      urlParams.set('itemPriceHash1', hashAmount(secret, price));
    }
    if (bookingId) {
      urlParams.set('invoiceNumber', String(bookingId));
      urlParams.set('orderNumber', String(bookingId));
    }
    const url = `${baseUrl}?${urlParams.toString()}\n`;

    // Build POST action + fields for auto-submit form
    const action = `${baseUrl}?token=${encodeURIComponent(token)}`;
    const fields = {
      itemSKU1: String(sku),
      itemDescription1: String(description),
      itemQuantity1: String(quantity),
      itemPrice1: String(price),
    };
    if (hashMode === 'amount' && secret) {
      fields.amountHash = hashAmount(secret, amt);
    } else if (hashMode === 'item' && secret) {
      fields.itemPriceHash1 = hashAmount(secret, price);
    }
    if (bookingId) {
      fields.invoiceNumber = String(bookingId);
      fields.orderNumber = String(bookingId);
    }

    return new Response(JSON.stringify({ success: true, url, action, fields }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to build HPP request', details: String(error?.message || error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
