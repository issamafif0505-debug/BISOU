import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────
// BISOU middleware — i18n (fr primaire, ar secondaire) +
// protection légère de /admin (Payload gère l'auth réelle).
// ─────────────────────────────────────────────────────────────

const intlMiddleware = createMiddleware({
  locales: ['fr', 'ar'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisser Payload gérer /admin et /api entièrement.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    // Soft check: si aucun cookie Payload et on tape /admin directement,
    // on laisse passer — Payload redirige lui-même vers /admin/login.
    return NextResponse.next();
  }

  // i18n pour le reste du site public
  return intlMiddleware(request);
}

export const config = {
  // Ignore: static assets, _next internals, favicons, images, sitemap, robots
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icons|fonts|images|logo.svg|logo-alternate.svg|logo-monogram.svg|og).*)',
  ],
};
