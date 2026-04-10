/**
 * Users — Payload auth collection
 * --------------------------------
 * Backoffice admins & editors. Authentication is handled by Payload's
 * built-in auth system (JWT + cookie). The initial admin is created by the
 * seed runner (`pnpm seed`) from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars.
 */

import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    group: 'Système',
  },
  access: {
    // Only authenticated users can read their own / other user docs in admin.
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom complet',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editor' },
      ],
      label: 'Rôle',
    },
  ],
};

export default Users;
