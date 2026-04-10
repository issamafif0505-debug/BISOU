'use client';

import { useEffect } from 'react';
import { CloseIcon, MenuIcon } from '@/components/ui';
import Navigation, { mainNavLinks } from './Navigation';
import LangSwitcher from './LangSwitcher';
import { cn } from '@/lib/cn';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Drawer mobile slide-in depuis la droite.
 * Géré par l'état parent (Header) pour permettre de le déclencher depuis le bouton ☰.
 */
export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  // Lock scroll body quand ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Fermer avec Echap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={() => onOpenChange(false)}
        className={cn(
          'fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-bisou ease-bisou lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-[86%] max-w-sm bg-card shadow-[-8px_0_32px_rgba(0,0,0,0.6)]',
          'border-l border-gold/20 flex flex-col',
          'transition-transform duration-bisou ease-bisou lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
          <span className="font-serif text-2xl tracking-widest text-gold-gradient">BISOU</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fermer le menu"
            className="text-cream hover:text-gold transition-colors p-2 -m-2"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Navigation
            links={mainNavLinks}
            onItemClick={() => onOpenChange(false)}
            orientation="vertical"
          />
        </div>

        <div className="border-t border-gold/10 px-6 py-5 flex items-center justify-between">
          <LangSwitcher />
          <span className="text-xs text-grey tracking-wider font-sans">Marrakech — Maroc</span>
        </div>
      </aside>
    </>
  );
}

/** Bouton hamburger qui ouvre le drawer — à utiliser dans Header. */
export function MobileMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ouvrir le menu"
      className="lg:hidden p-2 -mr-2 text-cream hover:text-gold transition-colors"
    >
      <MenuIcon />
    </button>
  );
}

export default MobileMenu;
