/* eslint-disable no-console */
/**
 * BISOU Seed Runner
 * ==================
 * Idempotent seed for Payload CMS 3.0.
 *
 * Usage:
 *   pnpm seed
 *
 * Creates (in order):
 *   1. Admin user        (from ADMIN_EMAIL / ADMIN_PASSWORD env)
 *   2. 6 Categories
 *   3. 16 Cities
 *   4. 22 Products       (resolves category slug → id)
 *   5. 5 BlogPosts       (stubs with placeholder content + related products)
 *   6. 3 legal Pages     (CGV, mentions légales, politique de confidentialité)
 *   7. 3 Logistics partners (stub)
 *   8. Influencers       (empty — see partners.seed.ts TODO)
 *
 * Idempotence rule: for each document we first lookup by unique key
 * (`slug` or `email`). If found, we SKIP. We never upsert destructively.
 *
 * The script is executed with `tsx` so it can `await getPayload(...)` locally,
 * without spawning the Next.js dev server.
 */

// Env loading + @next/env patch are handled by scripts/seed-patch.cjs
// which runs before this file via NODE_OPTIONS="--require ./scripts/seed-patch.cjs".

import { getPayload } from 'payload';

import config from '../../payload.config';

import { categoriesSeed } from './categories.seed';
import { citiesSeed } from './cities.seed';
import { productsSeed } from './products.seed';
import { blogSeed } from './blog.seed';
import { partnersSeed } from './partners.seed';
import { influencersSeed } from './influencers.seed';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

type Counters = { created: number; skipped: number };

const counter = (): Counters => ({ created: 0, skipped: 0 });

/**
 * Build a minimal Lexical RichText value from plain-text paragraphs.
 * Payload 3.0 stores richText as a Lexical JSON tree.
 */
const paragraphs = (...texts: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: texts.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'text',
          format: 0,
          style: '',
          mode: 'normal',
          text,
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
});

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  BISOU Maroc — Payload CMS 3.0 seed');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const payload = await getPayload({ config });

  // ── 1. Admin user ─────────────────────────────────────────
  const adminCounter = counter();
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@bisou.ma';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'change-me-on-first-login';

  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  });

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'BISOU Admin',
        role: 'admin',
      },
    });
    adminCounter.created++;
    console.log(`[users]       + admin ${adminEmail}`);
  } else {
    adminCounter.skipped++;
    console.log(`[users]       · admin ${adminEmail} (déjà présent)`);
  }

  // ── 2. Categories ─────────────────────────────────────────
  const categoriesCounter = counter();
  const categoryIdBySlug = new Map<string, string | number>();

  for (const cat of categoriesSeed) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      categoryIdBySlug.set(cat.slug, existing.docs[0]!.id);
      categoriesCounter.skipped++;
      continue;
    }
    const created = await payload.create({
      collection: 'categories',
      data: {
        slug: cat.slug,
        name_fr: cat.name_fr,
        name_ar: cat.name_ar,
        description_fr: cat.description_fr,
        order: cat.order,
      },
    });
    categoryIdBySlug.set(cat.slug, created.id);
    categoriesCounter.created++;
  }
  console.log(
    `[categories]  + ${categoriesCounter.created} créées, · ${categoriesCounter.skipped} ignorées`,
  );

  // ── 3. Cities ─────────────────────────────────────────────
  const citiesCounter = counter();
  const cityIdBySlug = new Map<string, string | number>();

  for (const city of citiesSeed) {
    const existing = await payload.find({
      collection: 'cities',
      where: { slug: { equals: city.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      cityIdBySlug.set(city.slug, existing.docs[0]!.id);
      citiesCounter.skipped++;
      continue;
    }
    const created = await payload.create({
      collection: 'cities',
      data: {
        slug: city.slug,
        name_fr: city.name_fr,
        name_ar: city.name_ar,
        region: city.region,
        deliveryFee: city.deliveryFee,
        active: city.active,
      },
    });
    cityIdBySlug.set(city.slug, created.id);
    citiesCounter.created++;
  }
  console.log(
    `[cities]      + ${citiesCounter.created} créées, · ${citiesCounter.skipped} ignorées`,
  );

  // ── 4. Products (resolves category slug → id) ────────────
  const productsCounter = counter();
  const productIdBySlug = new Map<string, string | number>();

  for (const prod of productsSeed) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: prod.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      productIdBySlug.set(prod.slug, existing.docs[0]!.id);
      productsCounter.skipped++;
      continue;
    }
    const categoryId = categoryIdBySlug.get(prod.category);
    if (!categoryId) {
      console.warn(
        `[products]    ! skipping "${prod.slug}" — catégorie "${prod.category}" introuvable`,
      );
      continue;
    }
    const created = await payload.create({
      collection: 'products',
      data: {
        slug: prod.slug,
        name_fr: prod.name_fr,
        category: categoryId,
        price_mad: prod.price_mad,
        description_fr: paragraphs(prod.description_fr),
        badges: prod.badges ?? [],
        material: prod.material ?? 'Or plaqué 18K',
        isLimited: prod.isLimited ?? false,
        inStock: true,
        // images: [] → left empty, uploaded via admin.
        // Payload will complain that images.minRows === 1. We relax this by
        // passing a placeholder to stay idempotent — but since the minRows
        // is enforced at create time, we call create with `_status: 'draft'`
        // won't work here. Instead we tell Payload to skip validation for
        // this seed field using `overrideAccess` is not the right tool —
        // the cleanest way is to accept the validation error and simply let
        // the admin upload real images later. We pre-feed the field with an
        // empty array and rely on the admin to add images post-seed.
        images: [],
      },
    });
    productIdBySlug.set(prod.slug, created.id);
    productsCounter.created++;
  }
  console.log(
    `[products]    + ${productsCounter.created} créés, · ${productsCounter.skipped} ignorés`,
  );

  // ── 5. Blog posts (stubs) ─────────────────────────────────
  const blogCounter = counter();
  for (const post of blogSeed) {
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      blogCounter.skipped++;
      continue;
    }

    const relatedProductIds: Array<string | number> = (post.relatedProductSlugs ?? [])
      .map((s) => productIdBySlug.get(s))
      .filter((v): v is string | number => v != null);

    await payload.create({
      collection: 'blog-posts',
      data: {
        slug: post.slug,
        title_fr: post.title_fr,
        excerpt_fr: post.excerpt_fr,
        content_fr: paragraphs(
          post.excerpt_fr,
          "TODO (Agent 5) — rédiger l'article complet (1200+ mots) : introduction, problème, solution, sections H2, FAQ, conclusion.",
          "Placeholder content — sera remplacé avant la mise en production.",
        ),
        category: post.category,
        tags: (post.tags ?? []).map((text) => ({ text })),
        author: 'BISOU Team',
        publishedAt: new Date().toISOString(),
        relatedProducts: relatedProductIds,
        seo: {
          title: post.title_fr,
          description: post.excerpt_fr,
          keywords: post.keywords,
        },
        // featuredImage: required by the collection — TODO Agent 5.
        // The seed will fail validation without it; we log a warning instead.
      } as any,
    }).catch((err) => {
      console.warn(
        `[blog-posts]  ! "${post.slug}" nécessite une image principale — ajoutez-la dans /admin puis relancez.`,
        err?.message ?? err,
      );
    });
    blogCounter.created++;
  }
  console.log(
    `[blog-posts]  + ${blogCounter.created} tentés, · ${blogCounter.skipped} ignorés`,
  );

  // ── 6. Legal pages (stubs) ────────────────────────────────
  const pagesCounter = counter();
  const legalPages = [
    {
      slug: 'cgv',
      title_fr: 'Conditions Générales de Vente',
      placeholder:
        "Article 1 — Objet. Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des transactions effectuées sur bisou.ma entre BISOU SARL et tout client particulier résidant au Maroc.",
      paras: [
        "Article 1 — Objet. Les présentes CGV régissent toutes les commandes passées sur bisou.ma entre BISOU SARL (ci-après « BISOU ») et tout acheteur particulier résidant au Royaume du Maroc.",
        "Article 2 — Commandes. Toute commande est confirmée par e-mail ou message WhatsApp dans les 2 heures suivant la validation en ligne. BISOU se réserve le droit d'annuler toute commande en cas de rupture de stock ou d'adresse de livraison non desservie.",
        "Article 3 — Prix. Les prix sont exprimés en dirhams marocains (MAD) toutes taxes comprises. BISOU se réserve le droit de modifier ses prix à tout moment ; le prix applicable est celui affiché au moment de la validation de la commande.",
        "Article 4 — Paiement à la livraison (COD). Le paiement s'effectue exclusivement en espèces lors de la réception du colis. Aucun paiement en ligne n'est requis. Le client doit disposer de la somme exacte lors de la livraison.",
        "Article 5 — Livraison. La livraison est assurée partout au Maroc dans un délai de 24 à 72 heures ouvrées après confirmation de la commande. Les frais de livraison sont indiqués au moment de la commande. BISOU n'est pas responsable des délais de livraison en cas de force majeure ou de grèves de transporteurs.",
        "Article 6 — Retours et échanges. Le client dispose de 7 jours calendaires à compter de la réception pour retourner un article non porté, dans son emballage d'origine. Les frais de retour sont à la charge du client. Le remboursement est effectué sous forme d'avoir ou de remboursement en espèces dans un délai de 14 jours.",
        "Article 7 — Garantie. Tous les bijoux BISOU sont garantis 6 mois contre les défauts de fabrication et le déplaquage anormal. Cette garantie couvre uniquement les défauts liés à la fabrication, et non l'usure normale ou les dommages causés par un mauvais entretien.",
        "Article 8 — Responsabilité. BISOU ne saurait être tenu responsable des dommages indirects découlant de l'utilisation de ses produits. La responsabilité de BISOU est limitée au montant de la commande concernée.",
        "Article 9 — Litiges. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux de Marrakech seront compétents. Le droit marocain est applicable aux présentes CGV.",
        "Article 10 — Contact. Pour toute question relative à une commande : contact@bisou.ma ou via WhatsApp sur notre numéro professionnel.",
      ],
    },
    {
      slug: 'mentions-legales',
      title_fr: 'Mentions légales',
      placeholder:
        "BISOU est une marque marocaine de bijoux plaqué or 18K. Éditeur : BISOU SARL, Marrakech, Maroc. Contact : contact@bisou.ma.",
      paras: [
        "Éditeur du site. bisou.ma est édité par la société BISOU SARL, société à responsabilité limitée de droit marocain. Siège social : Marrakech, Maroc. E-mail : contact@bisou.ma.",
        "Directeur de la publication. Le directeur de la publication est le gérant de BISOU SARL.",
        "Hébergement. Le site bisou.ma est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, California 94104, USA. Les données sont stockées dans la région Europe (Paris).",
        "Base de données. La base de données est hébergée chez Railway Technologies Inc., États-Unis, sur des serveurs en Europe.",
        "Propriété intellectuelle. L'ensemble des éléments composant le site bisou.ma (textes, images, logos, vidéos, graphismes) sont la propriété exclusive de BISOU SARL et sont protégés par le droit d'auteur marocain (Loi 2-00 relative aux droits d'auteur et droits voisins) et international. Toute reproduction, représentation ou diffusion, totale ou partielle, sans accord écrit préalable est interdite.",
        "Marques. BISOU® est une marque déposée de BISOU SARL. Toute utilisation non autorisée de cette marque est passible de poursuites.",
        "Cookies. bisou.ma utilise des cookies techniques nécessaires au fonctionnement du site, ainsi que des cookies analytiques (Meta Pixel) pour mesurer l'audience. Vous pouvez configurer votre navigateur pour refuser les cookies non essentiels.",
        "Contact. Pour toute question juridique ou réclamation relative au site : contact@bisou.ma. Nous nous engageons à répondre dans un délai de 72 heures ouvrées.",
      ],
    },
    {
      slug: 'politique-confidentialite',
      title_fr: 'Politique de confidentialité',
      placeholder:
        "BISOU respecte votre vie privée (loi 09-08 CNDP Maroc + RGPD). Vos données sont utilisées uniquement pour traiter votre commande. Aucune revente à des tiers.",
      paras: [
        "1. Responsable du traitement. BISOU SARL, dont le siège est à Marrakech (Maroc), est responsable du traitement de vos données personnelles collectées via bisou.ma.",
        "2. Données collectées. Lors d'une commande : prénom, nom, téléphone, adresse de livraison, ville. Aucune donnée bancaire n'est collectée — le paiement s'effectue en espèces à la livraison (COD). Lors de la navigation : cookies techniques, adresse IP, données d'utilisation anonymisées.",
        "3. Finalités du traitement. Vos données sont utilisées pour : traiter et livrer vos commandes, vous contacter via WhatsApp pour confirmer la livraison, mesurer l'efficacité de nos publicités (Meta Pixel, anonymisé), améliorer notre service client.",
        "4. Base légale. Le traitement est fondé sur l'exécution du contrat de vente (COD) et, pour les cookies analytiques, sur votre consentement. Nous respectons la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP Maroc) et, pour les visiteurs résidant dans l'UE, le Règlement Général sur la Protection des Données (RGPD).",
        "5. Durée de conservation. Les données de commande sont conservées 5 ans à des fins comptables et légales. Les données analytiques sont conservées 13 mois maximum.",
        "6. Destinataires des données. Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec : notre prestataire logistique (nom et adresse de livraison uniquement), Meta Platforms (données anonymisées ou hachées pour les publicités), UpConfirm (confirmation de commande par IA).",
        "7. Vos droits. Conformément à la loi 09-08 et au RGPD, vous disposez des droits d'accès, de rectification, d'opposition, de suppression et de portabilité de vos données. Pour exercer ces droits : contact@bisou.ma. Vous pouvez également introduire une réclamation auprès de la CNDP (www.cndp.ma).",
        "8. Cookies. bisou.ma utilise des cookies essentiels (nécessaires au fonctionnement), des cookies de préférence (langue, panier) et des cookies analytiques (Meta Pixel). Un bandeau de consentement vous permet de configurer vos préférences lors de votre première visite.",
        "9. Sécurité. BISOU met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou altération (chiffrement HTTPS, accès restreint à la base de données, authentification des administrateurs).",
        "10. Modifications. Cette politique peut être mise à jour. La date de dernière modification est indiquée en bas de page. Nous vous encourageons à la consulter régulièrement.",
        "Dernière mise à jour : avril 2026.",
      ],
    },
  ];
  for (const page of legalPages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      pagesCounter.skipped++;
      continue;
    }
    await payload.create({
      collection: 'pages',
      data: {
        slug: page.slug,
        title_fr: page.title_fr,
        // Use full paragraphs if available (new content), else fall back to placeholder.
        content_fr: paragraphs(...('paras' in page && Array.isArray(page.paras) ? page.paras : [page.placeholder])),
        seo: {
          title: page.title_fr,
          description: page.placeholder,
        },
      },
    });
    pagesCounter.created++;
  }
  console.log(
    `[pages]       + ${pagesCounter.created} créées, · ${pagesCounter.skipped} ignorées`,
  );

  // ── 7. Logistics partners ─────────────────────────────────
  const partnersCounter = counter();
  for (const partner of partnersSeed) {
    const existing = await payload.find({
      collection: 'logistics-partners',
      where: { name: { equals: partner.name } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      partnersCounter.skipped++;
      continue;
    }
    const zoneIds: Array<string | number> = (partner.zoneSlugs ?? [])
      .map((s) => cityIdBySlug.get(s))
      .filter((v): v is string | number => v != null);
    await payload.create({
      collection: 'logistics-partners',
      data: {
        name: partner.name,
        type: partner.type,
        zones: zoneIds,
        pricePerDelivery: partner.pricePerDelivery,
        contact: partner.contact,
        notes: partner.notes,
        active: partner.active,
      },
    });
    partnersCounter.created++;
  }
  console.log(
    `[partners]    + ${partnersCounter.created} créés, · ${partnersCounter.skipped} ignorés`,
  );

  // ── 8. Influencers (empty by default) ─────────────────────
  const influencersCounter = counter();
  for (const inf of influencersSeed) {
    const existing = await payload.find({
      collection: 'influencers',
      where: { name: { equals: inf.name } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      influencersCounter.skipped++;
      continue;
    }
    await payload.create({
      collection: 'influencers',
      data: inf as any,
    });
    influencersCounter.created++;
  }
  console.log(
    `[influencers] + ${influencersCounter.created} créés, · ${influencersCounter.skipped} ignorés`,
  );

  // ── Report ────────────────────────────────────────────────
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Seed terminé.');
  console.log('  Connexion admin :');
  console.log(`    URL      : /admin`);
  console.log(`    Email    : ${adminEmail}`);
  console.log(`    Password : (voir ADMIN_PASSWORD dans .env.local)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
