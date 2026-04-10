/**
 * opengraph-image.tsx — Root OG image fallback
 * ---------------------------------------------
 * Rendered once by Next.js at build time (or ISR) into a 1200x630 PNG.
 * This is the OG card you see when BISOU is shared without a more
 * specific image (homepage, fallback, errors).
 *
 * BISOU aesthetic: gold on black, Cormorant Garamond feel (served as
 * inline font substitution — next/og cannot load Google Fonts without
 * a Buffer, so we use system fallbacks here).
 *
 * For per-route OG images (products, blog), create an opengraph-image.tsx
 * inside that route folder and reuse the same layout primitives.
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BISOU — Bijoux plaqués or au Maroc';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at center, #1a1a1a 0%, #0D0D0D 70%)',
          position: 'relative',
        }}
      >
        {/* Decorative corner flourishes */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            width: 80,
            height: 80,
            borderTop: '2px solid #D4AF37',
            borderLeft: '2px solid #D4AF37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 60,
            width: 80,
            height: 80,
            borderTop: '2px solid #D4AF37',
            borderRight: '2px solid #D4AF37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 60,
            width: 80,
            height: 80,
            borderBottom: '2px solid #D4AF37',
            borderLeft: '2px solid #D4AF37',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 60,
            width: 80,
            height: 80,
            borderBottom: '2px solid #D4AF37',
            borderRight: '2px solid #D4AF37',
          }}
        />

        {/* Logo wordmark */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 700,
            letterSpacing: 24,
            color: '#D4AF37',
            fontFamily: 'serif',
            lineHeight: 1,
            marginBottom: 20,
            textShadow: '0 4px 40px rgba(212,175,55,0.4)',
          }}
        >
          BISOU
        </div>

        {/* Gold divider line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div style={{ width: 80, height: 1, background: '#D4AF37' }} />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: '#D4AF37',
            }}
          />
          <div style={{ width: 80, height: 1, background: '#D4AF37' }} />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 48,
            color: '#FDF6E3',
            fontFamily: 'serif',
            fontStyle: 'italic',
            letterSpacing: 2,
          }}
        >
          L&apos;or qui t&apos;embrasse
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: '#AAAAAA',
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          Bijoux plaqués or 18K · Maroc
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
