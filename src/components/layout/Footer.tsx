import Link from 'next/link';
import { Container, InstagramIcon, FacebookIcon, TikTokIcon, MailIcon, MapPinIcon } from '@/components/ui';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';

interface FooterColumn {
  title: string;
  links: Array<{ href: string; label: string }>;
}

const columns: FooterColumn[] = [
  {
    title: 'Boutique',
    links: [
      { href: '/collections/colliers', label: 'Colliers' },
      { href: '/collections/bagues', label: 'Bagues' },
      { href: '/collections/boucles', label: "Boucles d'oreilles" },
      { href: '/collections/bracelets', label: 'Bracelets' },
      { href: '/collections/coffrets', label: 'Coffrets cadeaux' },
      { href: '/collections/editions', label: 'Éditions limitées' },
    ],
  },
  {
    title: 'Maison BISOU',
    links: [
      { href: '/about', label: 'Notre histoire' },
      { href: '/blog', label: 'Journal' },
      { href: '/contact', label: 'Nous contacter' },
    ],
  },
  {
    title: 'Service client',
    links: [
      { href: '/contact', label: 'Aide & FAQ' },
      { href: '/contact', label: 'Livraison COD' },
      { href: '/contact', label: 'Retours & garantie' },
    ],
  },
  {
    title: 'Mentions',
    links: [
      { href: '/cgv', label: 'CGV' },
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/politique-confidentialite', label: 'Confidentialité' },
    ],
  },
];

/**
 * Footer boutique BISOU — multi-colonnes.
 * Server Component (pas d'interactivité).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-gold/15 bg-black text-cream font-sans">
      {/* Gold glow accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <Container>
        <div className="grid grid-cols-1 gap-12 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand block */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" aria-label="BISOU — Accueil" className="inline-flex">
              <span className="font-serif text-3xl tracking-[0.22em] text-gold-gradient font-light">
                BISOU
              </span>
            </Link>
            <p className="text-sm text-grey leading-relaxed max-w-xs">
              Bijoux plaqués or pensés à Marrakech, livrés partout au Maroc. Chaque pièce, un baiser.
            </p>
            <div className="flex items-center gap-3 text-xs text-grey">
              <MapPinIcon className="text-gold" />
              <span>Marrakech · Tout le Maroc</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-grey">
              <MailIcon className="text-gold" />
              <a href="mailto:contact@bisou.ma" className="hover:text-gold transition-colors">
                contact@bisou.ma
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com/bisou.ma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram BISOU"
                className="text-grey hover:text-gold transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com/bisou.ma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook BISOU"
                className="text-grey hover:text-gold transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://tiktok.com/@bisou.ma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok BISOU"
                className="text-grey hover:text-gold transition-colors"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-xs uppercase tracking-[0.18em] text-gold font-sans font-semibold">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-grey">
                {col.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link href={link.href} className="hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-gold font-sans font-semibold">
              Infolettre dorée
            </h3>
            <p className="text-sm text-grey leading-relaxed">
              Recevez les nouveautés, éditions limitées et offres privées BISOU.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-white/5 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-grey">
          <p>
            © {year} BISOU Maroc — L&apos;or qui t&apos;embrasse. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2">
            <span>Paiement à la livraison · Garantie 6 mois · Acier 316L</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
