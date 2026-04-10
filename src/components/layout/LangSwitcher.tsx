'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/cn';

/**
 * Sélecteur de langue FR / AR.
 * STUB — bascule naïvement entre `/` et `/ar/*` via next/navigation.
 * TODO(Agent 6): connecter à next-intl `useLocale()` + `Link` localisé
 * quand l'i18n sera câblée (voir plan §6).
 */
export function LangSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isArabic = pathname.startsWith('/ar');
  const current: 'fr' | 'ar' = isArabic ? 'ar' : 'fr';

  function switchTo(lang: 'fr' | 'ar') {
    if (lang === current) return;
    let next: string;
    if (lang === 'ar') {
      next = pathname === '/' ? '/ar' : `/ar${pathname}`;
    } else {
      next = pathname.replace(/^\/ar/, '') || '/';
    }
    startTransition(() => router.push(next));
  }

  const baseBtn =
    'text-xs font-sans uppercase tracking-[0.18em] transition-colors duration-bisou ease-bisou px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded';

  return (
    <div
      className={cn('flex items-center gap-1 text-grey', isPending && 'opacity-60', className)}
      role="group"
      aria-label="Changer la langue"
    >
      <button
        type="button"
        onClick={() => switchTo('fr')}
        aria-pressed={current === 'fr'}
        className={cn(baseBtn, current === 'fr' ? 'text-gold font-semibold' : 'hover:text-cream')}
      >
        FR
      </button>
      <span className="text-grey/40" aria-hidden="true">/</span>
      <button
        type="button"
        onClick={() => switchTo('ar')}
        aria-pressed={current === 'ar'}
        className={cn(baseBtn, current === 'ar' ? 'text-gold font-semibold' : 'hover:text-cream')}
      >
        AR
      </button>
    </div>
  );
}

export default LangSwitcher;
