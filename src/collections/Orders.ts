/**
 * Orders — COD (Cash On Delivery)
 * --------------------------------
 * Mirrors the 13 columns of the current Google Sheet backend so the data model
 * remains familiar, plus adds tracking metadata (fbc, fbp, ip, userAgent)
 * for Meta CAPI de-duplication.
 *
 * Auto-generated `orderId` (format `CMD-001`, `CMD-002`…) via `beforeChange`
 * hook on create.
 *
 * Access: admin only — public orders are created via the dedicated API route
 * `POST /api/orders` (Agent 4), which uses Payload's local API with
 * `overrideAccess: true`.
 */

import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';

/**
 * Hook — generate the next orderId (CMD-###) when creating a new order.
 * Idempotent on update (never mutates an existing orderId).
 */
const generateOrderId: CollectionBeforeChangeHook = async ({
  operation,
  data,
  req,
}) => {
  if (operation === 'create' && !data.orderId) {
    try {
      const last = await req.payload.find({
        collection: 'orders',
        sort: '-createdAt',
        limit: 1,
        depth: 0,
      });
      const lastOrderId = last.docs[0]?.orderId;
      const lastNum = lastOrderId
        ? parseInt(String(lastOrderId).replace('CMD-', ''), 10) || 0
        : 0;
      data.orderId = `CMD-${String(lastNum + 1).padStart(3, '0')}`;
    } catch (err) {
      // Fallback: timestamp-based if the query fails for any reason.
      req.payload.logger.warn(
        `[orders] Failed to compute next orderId, falling back to timestamp: ${String(
          err,
        )}`,
      );
      data.orderId = `CMD-${Date.now()}`;
    }
  }
  return data;
};

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: [
      'orderId',
      'prenom',
      'nom',
      'telephone',
      'ville',
      'produit',
      'prix_mad',
      'statut',
      'paye',
      'createdAt',
    ],
    group: 'Commandes',
  },
  // Admin-only: the public checkout uses the API route with overrideAccess.
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  hooks: {
    beforeChange: [generateOrderId],
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Auto-généré : CMD-001, CMD-002, …',
      },
    },
    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'prenom',
      type: 'text',
      required: true,
      label: 'Prénom',
    },
    {
      name: 'nom',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'telephone',
      type: 'text',
      required: true,
      label: 'Téléphone',
      // Phone format validation is also enforced by Zod at the API route level.
      validate: (val: unknown) => {
        if (typeof val !== 'string' || val.length === 0) return 'Téléphone requis';
        // Morocco phone: allow 0XXXXXXXXX, +212XXXXXXXXX, 212XXXXXXXXX.
        const re = /^(\+?212|0)[5-7]\d{8}$/;
        const cleaned = val.replace(/[\s.-]/g, '');
        if (!re.test(cleaned)) {
          return 'Format téléphone marocain invalide (ex: 0612345678)';
        }
        return true;
      },
    },
    {
      name: 'ville',
      type: 'relationship',
      relationTo: 'cities',
      required: true,
      hasMany: false,
      label: 'Ville',
    },
    {
      name: 'adresse',
      type: 'textarea',
      required: true,
      label: 'Adresse complète',
    },
    {
      name: 'produit',
      type: 'text',
      required: true,
      label: 'Produit (libellé)',
      admin: {
        description: 'Snapshot du nom produit au moment de la commande.',
      },
    },
    {
      name: 'productRef',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      label: 'Produit (référence)',
      admin: {
        description: 'Lien vers la fiche produit Payload (optionnel).',
      },
    },
    {
      name: 'prix_mad',
      type: 'number',
      required: true,
      min: 0,
      label: 'Prix (MAD)',
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Note client',
    },
    {
      name: 'statut',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Statut',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'En livraison', value: 'shipping' },
        { label: 'Livrée', value: 'delivered' },
        { label: 'Refusée', value: 'refused' },
      ],
    },
    {
      name: 'livreur',
      type: 'text',
      label: 'Livreur',
    },
    {
      name: 'paye',
      type: 'checkbox',
      defaultValue: false,
      label: 'Payée',
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'website',
      label: 'Source',
      options: [
        { label: 'Site web', value: 'website' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'UpConfirm', value: 'upconfirm' },
      ],
    },
    // Tracking metadata — hidden from the admin sidebar but persisted for
    // Meta Conversions API de-duplication and debugging.
    {
      name: 'metaFbc',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'metaFbp',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'ip',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { hidden: true },
    },
  ],
};

export default Orders;
