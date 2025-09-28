// src/app/layout.jsx

export const metadata = {
  title: 'Suncoast Livescan | Biometric Identity Solutions',
  description: 'Fingerprinting, background checks, and identity services made secure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Helcim core (optional) */}
        <script src="https://secure.helcim.com/js/helcim.js"></script>
        {/* Merchant Helcim script that provides window.helcimProcess */}
        <script type="text/javascript" src="https://arcpoint-labs-of-north-tampa.myhelcim.com/js/version2.js"></script>
        {/* HelcimPay.js modal script (correct URL from docs) */}
        <script type="text/javascript" src="https://secure.helcim.app/helcim-pay/services/start.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
