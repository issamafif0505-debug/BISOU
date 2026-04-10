import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description:
    'Conditions générales de vente BISOU Maroc — modalités COD, livraison, retours, garantie 6 mois, paiement à la livraison.',
  alternates: { canonical: '/cgv' },
};

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-black pb-24">
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'CGV' }]}
      />

      <Container className="max-w-3xl pt-8">
        <h1 className="font-serif text-3xl md:text-4xl text-cream font-light mt-4 mb-10">
          Conditions Générales de Vente
        </h1>

        <div className="flex flex-col gap-10 font-sans text-grey text-sm leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-cream mb-3">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent toute commande passée sur le site{' '}
              <strong className="text-cream">bisou.ma</strong> (ci-après « le Site »), exploité par BISOU Maroc,
              boutique de bijoux plaqués or domiciliée à Marrakech, Maroc.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">2. Produits</h2>
            <p>
              Les bijoux BISOU sont fabriqués en acier inoxydable 316L plaqué or 18K. Hypoallergéniques,
              résistants à l'eau et aux frottements. Les visuels produits sont représentatifs mais peuvent
              légèrement varier selon les écrans.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">3. Prix</h2>
            <p>
              Les prix sont affichés en <strong className="text-cream">Dirhams marocains (MAD)</strong>, toutes
              taxes comprises. BISOU se réserve le droit de modifier ses prix à tout moment, sans que cela
              n'affecte les commandes déjà confirmées.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">4. Mode de paiement — COD</h2>
            <p>
              BISOU pratique exclusivement le <strong className="text-cream">paiement à la livraison (COD —
              Contre-Remboursement)</strong>. Aucun paiement en ligne n'est requis à la commande.
              Le montant est réglé directement au livreur, en espèces, à la réception du colis.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">5. Commande et confirmation</h2>
            <p>
              La commande est validée via le formulaire en ligne ou WhatsApp. Une confirmation vous sera envoyée
              par téléphone ou WhatsApp dans les 24 heures ouvrables suivant la réception de votre demande.
              BISOU se réserve le droit d'annuler une commande en cas de doute sur l'adresse ou de non-joignabilité.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">6. Livraison</h2>
            <ul className="list-disc list-inside flex flex-col gap-2">
              <li>Délai : <strong className="text-cream">48 à 72 heures ouvrables</strong> partout au Maroc.</li>
              <li>Partenaires : Amana, Glovo, Aramex, CTM Messageries — selon votre ville.</li>
              <li>Frais de livraison : gratuits au-delà de 299 MAD (sous conditions).</li>
              <li>Vous serez contacté avant la livraison pour confirmer l'heure et le lieu.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">7. Retours & remboursements</h2>
            <p>
              Vous disposez de <strong className="text-cream">7 jours</strong> à compter de la réception pour
              retourner un article non porté, dans son emballage d'origine, pour échange ou avoir.
              Les frais de retour sont à la charge du client, sauf en cas de défaut avéré.
              Contactez-nous via WhatsApp ou e-mail pour initier un retour.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">8. Garantie</h2>
            <p>
              Tous les bijoux BISOU sont couverts par une{' '}
              <strong className="text-cream">garantie commerciale de 6 mois</strong> contre tout défaut de
              fabrication (décoloration anormale, soudure défaillante, fermoir cassé). La garantie ne couvre
              pas l'usure normale, les égratignures ou les dommages liés à un mauvais entretien.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">9. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus du Site (textes, photos, logos, design) est la propriété exclusive de
              BISOU Maroc. Toute reproduction sans accord écrit est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">10. Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit marocain. Tout litige sera soumis aux tribunaux compétents
              de Marrakech.
            </p>
          </section>

          <p className="text-xs text-grey/60">Dernière mise à jour : janvier 2026</p>
        </div>
      </Container>
    </main>
  );
}
