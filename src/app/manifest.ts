import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BISOU — Bijoux plaqués or au Maroc',
    short_name: 'BISOU',
    description: "L'or qui t'embrasse — livraison COD partout au Maroc",
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D0D',
    theme_color: '#D4AF37',
    lang: 'fr-MA',
    dir: 'ltr',
    orientation: 'portrait',
    categories: ['shopping', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/og/default.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Collections',
        url: '/collections',
        description: 'Voir nos bijoux',
      },
      {
        name: 'Commander',
        url: '/checkout',
        description: 'Passer une commande COD',
      },
    ],
  };
}
