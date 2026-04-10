/**
 * Blog seed — 5 cornerstone SEO articles
 * ----------------------------------------
 * Stubs only — Agent 5 will replace the content with full 1200+ mots articles.
 * Tags and keywords come from plan §5.2.
 */

export type BlogSeed = {
  slug: string;
  title_fr: string;
  excerpt_fr: string;
  category: 'guide' | 'conseil' | 'tendance' | 'education';
  tags?: string[];
  /** Slugs of related products — resolved to IDs by the seed runner. */
  relatedProductSlugs?: string[];
  keywords?: string;
};

export const blogSeed: BlogSeed[] = [
  {
    slug: 'bijoux-hypoallergeniques-maroc',
    title_fr: 'Bijoux hypoallergéniques au Maroc : le guide complet 2026',
    excerpt_fr:
      "Peaux sensibles, allergies au nickel, démangeaisons ? Découvrez pourquoi l'or plaqué 18K sur base acier 316L est la réponse, et comment choisir vos bijoux pour ne plus jamais souffrir.",
    category: 'guide',
    tags: ['hypoallergénique', 'acier 316L', 'maroc', 'plaqué or', 'peau sensible'],
    relatedProductSlugs: [
      'collier-minimaliste-or',
      'bague-empilable',
      'creoles-or-classiques',
    ],
    keywords: 'bijoux hypoallergéniques maroc, sans nickel, acier 316L, plaqué or',
  },
  {
    slug: 'acier-316l-vs-plaque-or',
    title_fr: 'Acier 316L vs plaqué or : lequel choisir pour durer ?',
    excerpt_fr:
      "Comparatif complet entre l'acier chirurgical 316L et le plaqué or 18K : durabilité, aspect, prix, entretien. Notre verdict pour le marché marocain.",
    category: 'education',
    tags: ['acier 316L', 'plaqué or', 'comparatif', 'durabilité'],
    relatedProductSlugs: ['bague-signature-or', 'chaine-classique'],
    keywords: 'acier 316l plaqué or différence, lequel choisir',
  },
  {
    slug: 'bijoux-sans-allergie-femme-marocaine',
    title_fr: 'Bijoux sans allergie pour femme marocaine : notre sélection 2026',
    excerpt_fr:
      "Notre sélection 2026 de bijoux adaptés aux peaux les plus sensibles, testés et approuvés par nos clientes marocaines. Zéro démangeaison, 100 % élégance.",
    category: 'conseil',
    tags: ['sans allergie', 'femme', 'maroc', 'sélection'],
    relatedProductSlugs: [
      'creoles-or-classiques',
      'puces-discretes',
      'bague-empilable',
    ],
    keywords: 'bijoux sans allergie femme, peau sensible',
  },
  {
    slug: 'bracelet-etanche-mariage-maroc',
    title_fr: 'Bracelet étanche pour mariage au Maroc : nos 5 favoris',
    excerpt_fr:
      "Pour votre mariage ou celui d'une amie, choisissez un bracelet étanche qui tiendra face aux parfums, à l'eau et au henné. Nos 5 modèles favoris, tous en or plaqué 18K.",
    category: 'tendance',
    tags: ['bracelet', 'étanche', 'mariage', 'maroc', 'henné'],
    relatedProductSlugs: ['bracelet-jonc', 'bracelet-maille-or', 'coffret-luxe'],
    keywords: 'bracelet étanche mariage maroc, bijoux résistant eau',
  },
  {
    slug: 'collier-prenom-arabe-cadeau',
    title_fr: 'Collier prénom arabe : le cadeau personnalisé idéal au Maroc',
    excerpt_fr:
      "Offrez un collier personnalisé au prénom de votre bien-aimée en calligraphie arabe — le cadeau qui touche à chaque fois. Inspirations, tailles et conseils.",
    category: 'guide',
    tags: ['collier', 'prénom', 'arabe', 'cadeau', 'personnalisé'],
    relatedProductSlugs: [
      'collier-minimaliste-or',
      'set-marrakech',
      'pack-decouverte',
    ],
    keywords: 'collier prénom arabe cadeau, bijou personnalisé maroc',
  },
];
