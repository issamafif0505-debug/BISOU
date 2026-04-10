/**
 * Categories seed — 6 items
 * --------------------------
 * Matches the 6 categories displayed on the current `brand/product-catalog.html`.
 */

export type CategorySeed = {
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr?: string;
  order: number;
};

export const categoriesSeed: CategorySeed[] = [
  {
    slug: 'colliers',
    name_fr: 'Colliers',
    name_ar: 'قلادات',
    description_fr: 'Chaînes et colliers en or plaqué 18K, de la pièce minimaliste au statement.',
    order: 1,
  },
  {
    slug: 'bagues',
    name_fr: 'Bagues',
    name_ar: 'خواتم',
    description_fr: 'Signatures, chevalières et empilables en or plaqué 18K.',
    order: 2,
  },
  {
    slug: 'boucles',
    name_fr: "Boucles d'oreilles",
    name_ar: 'أقراط',
    description_fr: 'Créoles, puces, pendantes — toutes en or plaqué 18K hypoallergénique.',
    order: 3,
  },
  {
    slug: 'bracelets',
    name_fr: 'Bracelets',
    name_ar: 'أساور',
    description_fr: 'Joncs, mailles et gourmettes en or plaqué 18K, pensés pour le quotidien.',
    order: 4,
  },
  {
    slug: 'coffrets',
    name_fr: 'Coffrets cadeaux',
    name_ar: 'علب هدايا',
    description_fr: 'Ensembles coordonnés prêts à offrir, emballage BISOU inclus.',
    order: 5,
  },
  {
    slug: 'editions',
    name_fr: 'Éditions limitées',
    name_ar: 'إصدارات محدودة',
    description_fr: 'Collections numérotées, en série limitée.',
    order: 6,
  },
];
