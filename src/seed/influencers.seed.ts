/**
 * Influencers seed
 * ----------------
 * TODO (Agent 5): import the full CRM from `docs/influencers-database.md`.
 * Empty by default — the collection will be filled manually from the admin
 * or by a dedicated import script.
 */

export type InfluencerSeed = {
  name: string;
  handle?: string;
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  followers?: number;
  engagementRate?: number;
  niche?: string;
  contactPhone?: string;
  contactEmail?: string;
  rate?: number;
  status?: 'prospect' | 'contacted' | 'active' | 'archived';
  notes?: string;
};

export const influencersSeed: InfluencerSeed[] = [
  // Empty by default. See TODO above.
];
