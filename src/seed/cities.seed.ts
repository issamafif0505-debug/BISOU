/**
 * Cities seed — 16 villes Maroc
 * ------------------------------
 * Covered by BISOU's COD delivery network. Delivery fees are indicative;
 * override in Payload admin when partner contracts are finalised.
 *
 * Pricing convention (plan §3):
 *  - Marrakech : 20 MAD (hub)
 *  - Casablanca : 25 MAD (axe principal)
 *  - Axe standard : 30 MAD
 *  - Hors-axe : 40 MAD
 */

export type CitySeed = {
  slug: string;
  name_fr: string;
  name_ar?: string;
  region?: string;
  deliveryFee: number;
  active: boolean;
};

export const citiesSeed: CitySeed[] = [
  { slug: 'marrakech',    name_fr: 'Marrakech',    name_ar: 'مراكش',     region: 'Marrakech-Safi',          deliveryFee: 20, active: true },
  { slug: 'casablanca',   name_fr: 'Casablanca',   name_ar: 'الدار البيضاء', region: 'Casablanca-Settat',   deliveryFee: 25, active: true },
  { slug: 'rabat',        name_fr: 'Rabat',        name_ar: 'الرباط',     region: 'Rabat-Salé-Kénitra',      deliveryFee: 30, active: true },
  { slug: 'fes',          name_fr: 'Fès',          name_ar: 'فاس',        region: 'Fès-Meknès',              deliveryFee: 30, active: true },
  { slug: 'agadir',       name_fr: 'Agadir',       name_ar: 'أكادير',     region: 'Souss-Massa',             deliveryFee: 35, active: true },
  { slug: 'tanger',       name_fr: 'Tanger',       name_ar: 'طنجة',       region: 'Tanger-Tétouan-Al Hoceïma', deliveryFee: 35, active: true },
  { slug: 'meknes',       name_fr: 'Meknès',       name_ar: 'مكناس',      region: 'Fès-Meknès',              deliveryFee: 30, active: true },
  { slug: 'oujda',        name_fr: 'Oujda',        name_ar: 'وجدة',       region: 'L\'Oriental',             deliveryFee: 40, active: true },
  { slug: 'kenitra',      name_fr: 'Kénitra',      name_ar: 'القنيطرة',   region: 'Rabat-Salé-Kénitra',      deliveryFee: 30, active: true },
  { slug: 'tetouan',      name_fr: 'Tétouan',      name_ar: 'تطوان',      region: 'Tanger-Tétouan-Al Hoceïma', deliveryFee: 35, active: true },
  { slug: 'safi',         name_fr: 'Safi',         name_ar: 'آسفي',       region: 'Marrakech-Safi',          deliveryFee: 30, active: true },
  { slug: 'el-jadida',    name_fr: 'El Jadida',    name_ar: 'الجديدة',    region: 'Casablanca-Settat',       deliveryFee: 30, active: true },
  { slug: 'beni-mellal',  name_fr: 'Béni Mellal',  name_ar: 'بني ملال',   region: 'Béni Mellal-Khénifra',    deliveryFee: 35, active: true },
  { slug: 'laayoune',     name_fr: 'Laâyoune',     name_ar: 'العيون',     region: 'Laâyoune-Sakia El Hamra', deliveryFee: 40, active: true },
  { slug: 'dakhla',       name_fr: 'Dakhla',       name_ar: 'الداخلة',    region: 'Dakhla-Oued Ed-Dahab',    deliveryFee: 40, active: true },
  { slug: 'autre-ville',  name_fr: 'Autre ville',  name_ar: 'مدينة أخرى',                                    deliveryFee: 40, active: true },
];
