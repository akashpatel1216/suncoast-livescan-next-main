# Suncoast LiveScan Next

## Helcim Payment Integration (Scaffold)

This project includes a scaffolded server endpoint and UI step to require payment before confirming a booking.

- API route: `src/app/api/helcim/create-checkout/route.js`
- UI flow: Payment step added to `src/components/Booking/Booking.jsx`

Environment variables (add to your `.env.local`):

- `HELCIM_API_TOKEN` — Your Helcim API token (required)
- `HELCIM_ENV` — `sandbox` or `production` (default: `sandbox`)
- `HELCIM_BUSINESS_ID` — Optional business ID if needed by your account

Notes:
- The server endpoint currently returns a placeholder `checkoutUrl`. Replace the scaffold with a real HelcimPay.js session initialization or Payment API call per your account.
- Placeholder price is set in `Booking.jsx` as `priceAmount = 65.00`. Adjust as needed or pass pricing from your service catalog.

For Helcim API overview and PCI considerations, see the Helcim Developer Docs: https://devdocs.helcim.com/docs/overview-of-helcim-api
