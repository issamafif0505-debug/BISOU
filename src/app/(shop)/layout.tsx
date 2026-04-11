import { Cormorant_Garamond, Jost } from 'next/font/google';
import '@/app/globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloating } from '@/components/shop/WhatsAppFloating';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';

// ─────────────────────────────────────────────────────────────
// Fonts — uniquement pour le shop (pas pour l'admin Payload)
// ─────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
});

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jost',
  preload: true,
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen bg-black text-cream font-sans antialiased">
        <OrganizationSchema />
        <LocalBusinessSchema />
        <Header />
        <div className="pt-16 lg:pt-20">{children}</div>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
