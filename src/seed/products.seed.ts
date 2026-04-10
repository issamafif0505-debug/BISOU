/**
 * Products seed — 22 bijoux BISOU
 * --------------------------------
 * Exactly 22 items extracted from `brand/product-catalog.html` (now mirrored
 * in `legacy/brand/product-catalog.html` after Agent 1's move).
 *
 * Prices in MAD. Badges use the enum defined in `collections/Products.ts`.
 * `category` is the category slug — resolved to a Payload ID at seed time.
 */

export type ProductSeed = {
  slug: string;
  name_fr: string;
  category: string; // slug — resolved to Category ID by the seed runner
  price_mad: number;
  description_fr: string;
  badges?: Array<'bestseller' | 'nouveau' | 'edition-limitee' | 'pack'>;
  material?: string;
  isLimited?: boolean;
};

export const productsSeed: ProductSeed[] = [
  // ── COLLIERS (5) ─────────────────────────────────────────
  {
    slug: 'collier-minimaliste-or',
    name_fr: 'Collier Minimaliste Or',
    category: 'colliers',
    price_mad: 229,
    description_fr:
      "Élégance intemporelle avec cette chaîne minimaliste. La pièce signature pour toutes les occasions.",
    badges: ['bestseller'],
    material: 'Or plaqué 18K',
  },
  {
    slug: 'chaine-epaisse-or',
    name_fr: 'Chaîne Épaisse Or',
    category: 'colliers',
    price_mad: 349,
    description_fr:
      "Chaîne robuste et imposante pour un look affirmé et contemporain.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'collier-delicat-fin',
    name_fr: 'Collier Délicat Fin',
    category: 'colliers',
    price_mad: 199,
    description_fr:
      "Finesse et délicatesse pour un port quotidien tout en légèreté.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'chaine-classique',
    name_fr: 'Chaîne Classique',
    category: 'colliers',
    price_mad: 279,
    description_fr:
      "La chaîne qui traverse les générations avec une élégance discrète.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'collier-maille-plate',
    name_fr: 'Collier Maille Plate',
    category: 'colliers',
    price_mad: 399,
    description_fr:
      "Maille plate pour un rendu contemporain et sophistiqué.",
    material: 'Or plaqué 18K',
  },

  // ── BAGUES (5) ───────────────────────────────────────────
  {
    slug: 'bague-signature-or',
    name_fr: 'Bague Signature Or',
    category: 'bagues',
    price_mad: 179,
    description_fr:
      "Notre signature de marque, incontournable pour un style intemporel.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'chevaliere-or',
    name_fr: 'Chevalière Or',
    category: 'bagues',
    price_mad: 299,
    description_fr:
      "Chevalière imposante et prestigieuse, symbole d'élégance.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'bague-empilable',
    name_fr: 'Bague Empilable',
    category: 'bagues',
    price_mad: 149,
    description_fr:
      "À porter seule ou en trio pour plus d'effet et de personnalité.",
    badges: ['bestseller'],
    material: 'Or plaqué 18K',
  },
  {
    slug: 'bague-large-or',
    name_fr: 'Bague Large Or',
    category: 'bagues',
    price_mad: 249,
    description_fr:
      "Large et confortable pour un style affirmé au quotidien.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'bague-filigrane',
    name_fr: 'Bague Filigrane',
    category: 'bagues',
    price_mad: 189,
    description_fr:
      "Détails filigranés pour une élégance raffinée et délicate.",
    material: 'Or plaqué 18K',
  },

  // ── BOUCLES (4) ──────────────────────────────────────────
  {
    slug: 'creoles-or-classiques',
    name_fr: 'Créoles Or Classiques',
    category: 'boucles',
    price_mad: 159,
    description_fr:
      "Les créoles incontournables de chaque femme, indispensables.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'puces-discretes',
    name_fr: 'Puces Discrètes',
    category: 'boucles',
    price_mad: 139,
    description_fr:
      "Discrétion et élégance pour tous les jours, sans compromis.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'boucles-pendantes',
    name_fr: 'Boucles Pendantes',
    category: 'boucles',
    price_mad: 199,
    description_fr:
      "Élégance fluide avec ces pendantes dorées pour vos soirées.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'hoops-chunky',
    name_fr: 'Hoops Chunky',
    category: 'boucles',
    price_mad: 219,
    description_fr:
      "Imposantes et tendance pour un look fort et assumé.",
    material: 'Or plaqué 18K',
  },

  // ── BRACELETS (4) ────────────────────────────────────────
  {
    slug: 'bracelet-chaine-fine',
    name_fr: 'Bracelet Chaîne Fine',
    category: 'bracelets',
    price_mad: 189,
    description_fr:
      "Finesse et légèreté au poignet pour un port quotidien.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'bracelet-jonc',
    name_fr: 'Bracelet Jonc',
    category: 'bracelets',
    price_mad: 239,
    description_fr: "Jonc bangle pour un style minimaliste et épuré.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'bracelet-maille-or',
    name_fr: 'Bracelet Maille Or',
    category: 'bracelets',
    price_mad: 269,
    description_fr:
      "Maille entrecroisée pour plus de texture et de caractère.",
    material: 'Or plaqué 18K',
  },
  {
    slug: 'bracelet-gourmette',
    name_fr: 'Bracelet Gourmette',
    category: 'bracelets',
    price_mad: 219,
    description_fr:
      "Gourmette classique intemporelle pour toutes les générations.",
    material: 'Or plaqué 18K',
  },

  // ── COFFRETS (3) ─────────────────────────────────────────
  {
    slug: 'pack-decouverte',
    name_fr: 'Pack Découverte',
    category: 'coffrets',
    price_mad: 229,
    description_fr:
      "Coffret parfait pour découvrir BISOU — 3 pièces coordonnées.",
    badges: ['pack'],
    material: 'Or plaqué 18K',
  },
  {
    slug: 'coffret-luxe',
    name_fr: 'Coffret Luxe',
    category: 'coffrets',
    price_mad: 449,
    description_fr:
      "Coffret prestige avec présentation luxe — 4 pièces exclusives.",
    badges: ['pack'],
    material: 'Or plaqué 18K',
  },
  {
    slug: 'duo-parfait',
    name_fr: 'Duo Parfait',
    category: 'coffrets',
    price_mad: 279,
    description_fr:
      "Le combo idéal : bague + boucles — 2 pièces parfaitement assorties.",
    badges: ['pack'],
    material: 'Or plaqué 18K',
  },

  // ── ÉDITIONS (2) ─────────────────────────────────────────
  {
    slug: 'collection-edition-or-2026',
    name_fr: 'Collection Édition Or 2026',
    category: 'editions',
    price_mad: 599,
    description_fr:
      "Série limitée exclusive — Collection 2026. Numérotée et certifiée.",
    badges: ['edition-limitee', 'nouveau'],
    isLimited: true,
    material: 'Or plaqué 18K',
  },
  {
    slug: 'set-marrakech',
    name_fr: 'Set Marrakech',
    category: 'editions',
    price_mad: 379,
    description_fr:
      "Inspirée par la magie de Marrakech — Édition limitée en hommage à la ville rouge.",
    badges: ['edition-limitee'],
    isLimited: true,
    material: 'Or plaqué 18K',
  },
];
