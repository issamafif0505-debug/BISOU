'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container, WhatsAppIcon, Button } from '@/components/ui';
import { buildWhatsAppContactUrl } from '@/lib/whatsapp-client';
import Navigation from './Navigation';
import LangSwitcher from './LangSwitcher';
import { MobileMenu, MobileMenuTrigger } from './MobileMenu';
import { cn } from '@/lib/cn';

/**
 * Header boutique BISOU.
 * - Transparent en haut de page, devient opaque (dark glass) au scroll
 * - Desktop : logo + nav inline + lang + CTA WhatsApp
 * - Mobile : logo + trigger drawer
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-30 transition-all duration-bisou ease-bisou',
          scrolled
            ? 'bg-black/85 backdrop-blur-md border-b border-gold/10 shadow-card'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <Container>
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="BISOU — Accueil"
              className="flex items-center gap-2 shrink-0"
            >
              <span className="font-serif text-2xl lg:text-3xl tracking-[0.2em] text-gold-gradient font-light">
                BISOU
              </span>
            </Link>

            {/* Nav desktop */}
            <Navigation className="hidden lg:block" />

            {/* Right actions */}
            <div className="flex items-center gap-3 lg:gap-5">
              <div className="hidden lg:block">
                <LangSwitcher />
              </div>

              <Button
                as="a"
                href={buildWhatsAppContactUrl()}
                variant="whatsapp"
                size="sm"
                className="hidden md:inline-flex"
                icon={<WhatsAppIcon width={16} height={16} />}
                target="_blank"
                rel="noopener noreferrer"
              >
                Commander
              </Button>

              <MobileMenuTrigger onClick={() => setMenuOpen(true)} />
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}

export default Header;
