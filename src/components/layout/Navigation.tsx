import Link from 'next/link';

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Liens de navigation principaux BISOU.
 * Utilisé à la fois par Header desktop et MobileMenu.
 */
export const mainNavLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/collections/colliers', label: 'Colliers' },
  { href: '/collections/bagues', label: 'Bagues' },
  { href: '/collections/boucles', label: "Boucles d'oreilles" },
  { href: '/collections/bracelets', label: 'Bracelets' },
  { href: '/collections/coffrets', label: 'Coffrets' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
];

interface NavigationProps {
  links?: NavLink[];
  onItemClick?: () => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Navigation({
  links = mainNavLinks,
  onItemClick,
  className = '',
  orientation = 'horizontal',
}: NavigationProps) {
  const listClasses =
    orientation === 'horizontal'
      ? 'flex items-center gap-6 lg:gap-8'
      : 'flex flex-col gap-1';

  return (
    <nav aria-label="Navigation principale" className={className}>
      <ul className={listClasses}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onItemClick}
              className={
                orientation === 'horizontal'
                  ? 'text-sm uppercase tracking-[0.14em] text-cream/85 hover:text-gold transition-colors duration-bisou font-sans'
                  : 'block py-3 px-1 text-lg font-serif text-cream hover:text-gold transition-colors duration-bisou border-b border-white/5'
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
