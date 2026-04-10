import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { Container } from '@/components/ui';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';
import type { OrderForWhatsApp } from '@/lib/whatsapp';

interface Props {
  params: { orderId: string };
}

export const metadata: Metadata = {
  title: 'Commande confirmée — Merci !',
  description: 'Votre commande BISOU a été reçue. Nous vous contacterons très bientôt pour confirmer la livraison.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function loadOrder(orderId: string) {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'orders',
      where: { orderId: { equals: orderId } },
      limit: 1,
      depth: 1,
    });
    return res.docs[0] ?? null;
  } catch {
    return null;
  }
}

export default async function MerciPage({ params }: Props) {
  const order = await loadOrder(params.orderId);
  if (!order) notFound();

  const ville =
    typeof order.ville === 'object' && order.ville
      ? (order.ville as { name_fr?: string }).name_fr ?? String((order.ville as { slug?: string }).slug ?? '')
      : String(order.ville ?? '');

  const orderForWa: OrderForWhatsApp = {
    orderId: String(order.orderId),
    prenom: String(order.prenom),
    nom: String(order.nom),
    telephone: String(order.telephone),
    ville,
    adresse: String(order.adresse),
    produit: String(order.produit),
    prix: Number(order.prix_mad),
    note: order.note ? String(order.note) : undefined,
  };
  const waUrl = buildWhatsAppOrderUrl(orderForWa);

  return (
    <main className="min-h-screen bg-black py-16">
      <Container className="max-w-xl">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Success icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/60 bg-card shadow-gold-glow">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="18" stroke="#D4AF37" strokeWidth="1.5" />
              <path d="M12 20l6 6 10-12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 font-sans">
              Commande reçue
            </p>
            <h1 className="mt-2 font-serif text-3xl text-cream">
              Merci {String(order.prenom)} !
            </h1>
            <p className="mt-3 text-grey font-sans text-sm leading-relaxed">
              Votre commande <strong className="text-gold">{String(order.orderId)}</strong> a bien été enregistrée.
              Notre équipe vous contactera dans les prochaines heures pour confirmer la livraison.
            </p>
          </div>

          {/* Order recap */}
          <div className="w-full rounded-[14px] border border-gold/20 bg-card p-6 text-left flex flex-col gap-3">
            <h2 className="font-serif text-lg text-cream mb-1">Récapitulatif</h2>
            {[
              { label: 'Commande', value: String(order.orderId) },
              { label: 'Produit', value: String(order.produit) },
              { label: 'Montant', value: `${Number(order.prix_mad)} MAD — Paiement à la livraison` },
              { label: 'Livraison', value: ville },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 text-sm font-sans border-t border-white/5 pt-3">
                <span className="text-grey">{label}</span>
                <span className="text-cream text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 rounded-[12px] bg-whatsapp py-4 px-6 text-white font-sans font-semibold text-sm uppercase tracking-[0.14em] hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(37,211,102,0.4)]"
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.83.736 5.48 2.022 7.786L0 32l8.45-2.214C10.67 31.19 13.27 32 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.254 22.75c-.34.952-1.99 1.818-2.73 1.932-.697.107-1.574.153-2.538-.16-.585-.192-1.337-.449-2.295-.88-4.04-1.745-6.68-5.8-6.883-6.067-.2-.27-1.63-2.166-1.63-4.132 0-1.967 1.03-2.934 1.394-3.332.364-.4.797-.498 1.06-.498.263 0 .527.002.758.014.243.013.568-.092.888.678.34.806 1.16 2.771 1.262 2.971.1.2.168.435.033.7-.135.265-.203.43-.4.664-.2.232-.42.518-.6.695-.2.19-.408.397-.176.78.234.384 1.04 1.717 2.234 2.78 1.534 1.366 2.826 1.788 3.213 1.988.384.2.608.167.832-.1.225-.268.96-1.12 1.218-1.504.254-.383.508-.32.857-.192.35.128 2.217 1.046 2.6 1.237.382.19.637.286.73.447.092.16.092.928-.248 1.88z" />
            </svg>
            Confirmer sur WhatsApp
          </a>

          <Link href="/collections" className="text-sm text-grey hover:text-gold transition-colors font-sans underline underline-offset-4">
            Continuer mes achats
          </Link>
        </div>
      </Container>
    </main>
  );
}
