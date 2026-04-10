/**
 * PageView — SPA navigation tracker
 * -----------------------------------
 * Meta Pixel only fires PageView once at initial load. Next.js client
 * navigation doesn't reload the page, so subsequent route changes would
 * be invisible to the Pixel.
 *
 * This component listens to Next's `usePathname()` and `useSearchParams()`
 * and re-fires `fbq('track', 'PageView')` on every navigation.
 *
 * Place it once inside the public layout (alongside `<MetaPixel />`).
 */
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function PageViewInner(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.fbq) return;
    try {
      window.fbq('track', 'PageView');
    } catch {
      /* noop */
    }
    // Fire once per navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}

/**
 * Suspense boundary required because `useSearchParams()` in app router
 * bails out of static rendering without one.
 */
export function PageView(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <PageViewInner />
    </Suspense>
  );
}

export default PageView;
