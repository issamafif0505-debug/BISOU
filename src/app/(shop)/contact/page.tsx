import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { buildWhatsAppContactUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Nous contacter',
  description:
    'Contactez BISOU Maroc par WhatsApp, e-mail ou Instagram. Questions sur vos bijoux, commandes, livraisons — notre équipe répond sous 24h.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const waUrl = buildWhatsAppContactUrl("Bonjour BISOU, j'ai une question pour vous ✨");

  return (
    <main className="min-h-screen bg-black pb-24">
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'Contact' }]}
      />

      <Container className="max-w-2xl pt-8">
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 font-sans mb-3">Service client</p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream font-light">
            Parlons{' '}
            <em className="italic text-gold-gradient not-italic">bijoux</em>
          </h1>
          <p className="mt-4 text-grey font-sans text-sm leading-relaxed">
            Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.
            Le moyen le plus rapide : WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-4 rounded-[14px] border border-whatsapp/30 bg-card p-6 hover:border-whatsapp/70 hover:shadow-[0_8px_24px_rgba(37,211,102,0.2)] transition-all duration-bisou"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp/15">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="#25D366" aria-hidden="true">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.83.736 5.48 2.022 7.786L0 32l8.45-2.214C10.67 31.19 13.27 32 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.254 22.75c-.34.952-1.99 1.818-2.73 1.932-.697.107-1.574.153-2.538-.16-.585-.192-1.337-.449-2.295-.88-4.04-1.745-6.68-5.8-6.883-6.067-.2-.27-1.63-2.166-1.63-4.132 0-1.967 1.03-2.934 1.394-3.332.364-.4.797-.498 1.06-.498.263 0 .527.002.758.014.243.013.568-.092.888.678.34.806 1.16 2.771 1.262 2.971.1.2.168.435.033.7-.135.265-.203.43-.4.664-.2.232-.42.518-.6.695-.2.19-.408.397-.176.78.234.384 1.04 1.717 2.234 2.78 1.534 1.366 2.826 1.788 3.213 1.988.384.2.608.167.832-.1.225-.268.96-1.12 1.218-1.504.254-.383.508-.32.857-.192.35.128 2.217 1.046 2.6 1.237.382.19.637.286.73.447.092.16.092.928-.248 1.88z" />
              </svg>
            </div>
            <div>
              <h2 className="font-sans font-semibold text-cream mb-1">WhatsApp</h2>
              <p className="text-xs text-grey leading-relaxed">
                Réponse en moins d&apos;une heure en semaine. Le canal le plus rapide.
              </p>
            </div>
            <span className="text-xs uppercase tracking-[0.14em] text-whatsapp font-sans font-semibold">
              Démarrer la conversation →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:contact@bisou.ma"
            className="flex flex-col gap-4 rounded-[14px] border border-gold/15 bg-card p-6 hover:border-gold/40 transition-all duration-bisou"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>
            <div>
              <h2 className="font-sans font-semibold text-cream mb-1">E-mail</h2>
              <p className="text-xs text-grey">contact@bisou.ma</p>
              <p className="text-xs text-grey leading-relaxed mt-1">Réponse sous 24-48h ouvrables.</p>
            </div>
            <span className="text-xs uppercase tracking-[0.14em] text-gold font-sans font-semibold">
              Envoyer un message →
            </span>
          </a>
        </div>

        {/* FAQ rapide */}
        <div className="mt-14">
          <h2 className="font-serif text-xl text-cream mb-6">Questions fréquentes</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Comment passer une commande ?',
                a: "Choisissez votre bijou, cliquez sur « Commander COD », remplissez le formulaire. Vous serez contacté dans les 24h pour confirmer la livraison.",
              },
              {
                q: 'Livrez-vous partout au Maroc ?',
                a: 'Oui — nous livrons dans les 16 principales villes du Maroc (Marrakech, Casablanca, Rabat, Fès, Tanger, Agadir…) sous 48-72h.',
              },
              {
                q: 'Comment retourner un article ?',
                a: 'Contactez-nous par WhatsApp dans les 7 jours suivant la réception. Les retours sont acceptés pour les articles non portés, dans leur emballage d\'origine.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-[12px] border border-gold/15 bg-card">
                <summary className="cursor-pointer p-5 text-sm font-sans font-medium text-cream list-none flex justify-between items-center gap-4">
                  {q}
                  <span className="shrink-0 text-gold text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-grey font-sans leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
