/**
 * <CheckoutForm />
 * -----------------
 * Main COD checkout form. Client component that:
 *   1. Captures all client fields (prenom, nom, telephone, ville, adresse, note)
 *   2. Reads Meta Pixel cookies (fbc / fbp) if present → passed to server
 *   3. Validates locally via `orderSchema` (shared Zod)
 *   4. Submits to POST /api/orders
 *   5. On success: opens WhatsApp in new tab + redirects to /merci/{orderId}
 *
 * Uses plain React state (no `react-hook-form`) to avoid adding a new
 * dep at this stage. Refactorable later if we introduce it.
 */

'use client';

import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { CitySelect, type CityOption } from '@/components/checkout/CitySelect';
import { PhoneInput } from '@/components/checkout/PhoneInput';
import { orderSchema, type OrderInput } from '@/lib/validation';

export interface CheckoutProduct {
  slug?: string;
  name: string;
  price: number;
}

export interface CheckoutFormProps {
  cities: CityOption[];
  product: CheckoutProduct;
}

type FieldErrors = Partial<Record<keyof OrderInput, string>>;

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Reads a cookie by name, returns undefined if not set or on the server.
 */
function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function CheckoutForm({ cities, product }: CheckoutFormProps) {
  const router = useRouter();

  const [status, setStatus] = useState<Status>('idle');
  const [topError, setTopError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    ville: '',
    adresse: '',
    note: '',
  });

  const isSubmitting = status === 'submitting';

  const update = useCallback(
    (key: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
          if (!prev[key as keyof FieldErrors]) return prev;
          const next = { ...prev };
          delete next[key as keyof FieldErrors];
          return next;
        });
      },
    [],
  );

  const citiesProps = useMemo(() => ({ cities }), [cities]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTopError(null);
    setErrors({});

    const payload = {
      prenom: form.prenom,
      nom: form.nom,
      telephone: form.telephone,
      ville: form.ville,
      adresse: form.adresse,
      note: form.note || undefined,
      produit: product.name,
      productSlug: product.slug,
      prix: product.price,
      metaFbc: readCookie('_fbc'),
      metaFbp: readCookie('_fbp'),
    };

    // 1. Local validation
    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const mapped: FieldErrors = {};
      for (const [k, v] of Object.entries(flat)) {
        if (v && v.length > 0) mapped[k as keyof FieldErrors] = v[0];
      }
      setErrors(mapped);
      setTopError('Veuillez corriger les erreurs ci-dessous.');
      return;
    }

    // 2. Submit
    setStatus('submitting');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        orderId?: string;
        whatsappUrl?: string;
        error?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };

      if (!res.ok || !json.ok || !json.orderId || !json.whatsappUrl) {
        if (json.details?.fieldErrors) {
          const mapped: FieldErrors = {};
          for (const [k, v] of Object.entries(json.details.fieldErrors)) {
            if (v && v.length > 0) mapped[k as keyof FieldErrors] = v[0];
          }
          setErrors(mapped);
        }
        setTopError(json.error ?? 'Erreur lors de la création de la commande.');
        setStatus('error');
        return;
      }

      // 3. Success: open WhatsApp in a new tab + redirect to confirmation
      setStatus('success');
      try {
        window.open(json.whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // popup blocked — merci page will show a fallback CTA
      }
      router.push(`/merci/${encodeURIComponent(json.orderId)}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[BISOU] CheckoutForm submit failed', err);
      setTopError('Impossible de contacter le serveur. Réessayez.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {/* Section 1 — client */}
      <section className="flex flex-col gap-4">
        <h3 className="font-serif text-lg text-gold">1. Vos informations</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="prenom"
            label="Prénom"
            autoComplete="given-name"
            required
            value={form.prenom}
            onChange={update('prenom')}
            error={errors.prenom}
            placeholder="Amina"
          />
          <Input
            name="nom"
            label="Nom"
            autoComplete="family-name"
            required
            value={form.nom}
            onChange={update('nom')}
            error={errors.nom}
            placeholder="El Idrissi"
          />
        </div>
        <PhoneInput
          name="telephone"
          value={form.telephone}
          onChange={update('telephone')}
          error={errors.telephone}
        />
      </section>

      {/* Section 2 — livraison */}
      <section className="flex flex-col gap-4">
        <h3 className="font-serif text-lg text-gold">2. Livraison</h3>
        <CitySelect
          {...citiesProps}
          name="ville"
          value={form.ville}
          onChange={update('ville')}
          error={errors.ville}
        />
        <Textarea
          name="adresse"
          label="Adresse complète"
          required
          placeholder="Rue, numéro, quartier, points de repère"
          rows={3}
          value={form.adresse}
          onChange={update('adresse')}
          error={errors.adresse}
        />
        <Textarea
          name="note"
          label="Note (optionnel)"
          placeholder="Instructions spéciales pour le livreur"
          rows={2}
          value={form.note}
          onChange={update('note')}
          error={errors.note}
        />
      </section>

      {topError ? (
        <div
          role="alert"
          className="rounded-[10px] border border-status-red/40 bg-status-red/10 px-4 py-3 text-sm text-status-red"
        >
          {topError}
        </div>
      ) : null}

      <Button
        type="submit"
        variant="whatsapp"
        size="lg"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Envoi en cours...'
          : `Commander COD via WhatsApp · ${product.price} MAD`}
      </Button>

      <p className="text-center text-xs text-grey">
        En cliquant, vous acceptez les{' '}
        <a href="/cgv" className="text-gold underline-offset-4 hover:underline">
          Conditions Générales de Vente
        </a>
        . Paiement uniquement à la livraison.
      </p>
    </form>
  );
}

export default CheckoutForm;
