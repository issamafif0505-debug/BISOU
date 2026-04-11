import type { Metadata, Viewport } from 'next';

// ─────────────────────────────────────────────────────────────
// Root layout — BARE (no <html>/<body>).
// Each route group provides its own document structure:
//   (shop)/layout.tsx  → <html lang="fr"> + Tailwind
//   (payload)/layout.tsx → Payload's RootLayout (its own <html>)
// ─────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://bisou.ma';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'BISOU';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${SITE_NAME} — Bijoux plaqués or au Maroc`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "L'or qui t'embrasse. Découvrez les bijoux plaqués or BISOU — colliers, bagues, bracelets et boucles livrés partout au Maroc en paiement à la livraison.",
  applicationName: SITE_NAME,
  authors: [{ name: 'BISOU Maroc', url: APP_URL }],
  creator: 'BISOU',
  publisher: 'BISOU',
  keywords: [
    'bijoux plaques or',
    'bijoux maroc',
    'colliers or',
    'bagues or',
    'bracelet or',
    'livraison cod maroc',
    'bijoux hypoallergeniques',
    'bijoux luxe accessible',
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    alternateLocale: ['ar_MA'],
    url: APP_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Bijoux plaqués or au Maroc`,
    description: "L'or qui t'embrasse. Livraison paiement à la livraison partout au Maroc.",
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Bijoux plaqués or`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Bijoux plaqués or au Maroc`,
    description: "L'or qui t'embrasse. Livraison COD partout au Maroc.",
    images: ['/og/default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: APP_URL,
    languages: {
      'fr-MA': APP_URL,
      'ar-MA': `${APP_URL}/ar`,
      'x-default': APP_URL,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
