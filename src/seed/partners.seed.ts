/**
 * Logistics Partners seed
 * ------------------------
 * TODO (Agent 5): import the full CRM from `docs/logistics-partners.md`.
 * For now we keep a minimal set so the collection isn't empty in dev.
 */

export type PartnerSeed = {
  name: string;
  type: 'express' | 'standard' | 'moto' | 'relais';
  zoneSlugs?: string[]; // resolved to Cities IDs at seed time
  pricePerDelivery?: number;
  contact?: { name?: string; phone?: string; email?: string };
  notes?: string;
  active: boolean;
};

export const partnersSeed: PartnerSeed[] = [
  {
    name: 'Amana (Barid Al Maghrib)',
    type: 'standard',
    zoneSlugs: [
      'marrakech',
      'casablanca',
      'rabat',
      'fes',
      'agadir',
      'tanger',
      'meknes',
      'oujda',
      'kenitra',
      'tetouan',
      'safi',
      'el-jadida',
      'beni-mellal',
      'laayoune',
      'dakhla',
    ],
    pricePerDelivery: 25,
    notes: 'Couverture nationale. Bon pour hors-axe. Paiement contre livraison pris en charge.',
    active: true,
  },
  {
    name: 'Glovo Moto',
    type: 'moto',
    zoneSlugs: ['marrakech', 'casablanca', 'rabat'],
    pricePerDelivery: 35,
    notes: 'Livraison express intra-ville Marrakech / Casa / Rabat en <2h.',
    active: true,
  },
  {
    name: 'CTM Messagerie',
    type: 'express',
    zoneSlugs: [
      'marrakech',
      'casablanca',
      'rabat',
      'fes',
      'agadir',
      'tanger',
      'meknes',
      'oujda',
      'kenitra',
    ],
    pricePerDelivery: 30,
    notes: 'Messagerie fiable entre les grandes villes. J+1 ou J+2 selon destination.',
    active: true,
  },
];
