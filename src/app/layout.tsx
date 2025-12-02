import 'react-phone-number-input/style.css';
import './globals.css';

import { Cairo } from 'next/font/google';

import Providers from '@/providers/providers';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import Test from '@/components/tests/Test';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ar' dir='rtl' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${cairo.variable} antialiased`}>
        <Providers> {children}</Providers>
        
        
      </body>
    </html>
  );
}
