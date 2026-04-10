'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui';
import { buildWhatsAppContactUrl } from '@/lib/whatsapp-client';
import { cn } from '@/lib/cn';

/**
 * Bouton flottant WhatsApp — en bas à droite sur toutes les pages boutique.
 * - Apparaît après un petit scroll (pour ne pas cacher le hero)
 * - Pulsation douce pour attirer l'œil
 */
export function WhatsAppFloating() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppContactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      className={cn(
        'fixed bottom-5 right-5 z-40 flex items-center gap-3',
        'rounded-full bg-whatsapp pl-4 pr-5 py-3 text-white font-sans font-semibold',
        'shadow-[0_12px_36px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_40px_rgba(37,211,102,0.55)]',
        'transition-all duration-bisou ease-bisou hover:scale-105',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-3',
      )}
    >
      <span
        aria-hidden="true"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
      >
        <WhatsAppIcon />
        <span className="absolute inset-0 rounded-full animate-ping bg-white/25" />
      </span>
      <span className="hidden sm:inline text-sm uppercase tracking-[0.14em]">Commander</span>
    </a>
  );
}

export default WhatsAppFloating;
