// src/app/layout.jsx

import Script from 'next/script';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Suncoast Livescan | Biometric Identity Solutions',
  description: 'Fingerprinting, background checks, and identity services made secure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load scripts asynchronously to satisfy Next.js lint rules */}
        <Script src="https://secure.helcim.com/js/helcim.js" strategy="afterInteractive" />
        <Script src="https://arcpoint-labs-of-north-tampa.myhelcim.com/js/version2.js" strategy="afterInteractive" />
        <Script src="https://secure.helcim.app/helcim-pay/services/start.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
