import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité BISOU Maroc — protection des données personnelles, RGPD, loi 09-08 Maroc, cookies.',
  alternates: { canonical: '/politique-confidentialite' },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-black pb-24">
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'Confidentialité' }]}
      />

      <Container className="max-w-3xl pt-8">
        <h1 className="font-serif text-3xl md:text-4xl text-cream font-light mt-4 mb-10">
          Politique de confidentialité
        </h1>

        <div className="flex flex-col gap-10 font-sans text-grey text-sm leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-cream mb-3">1. Responsable du traitement</h2>
            <p>
              <strong className="text-cream">BISOU Maroc</strong>, domiciliée à Marrakech, Maroc.<br />
              Contact DPO : <a href="mailto:privacy@bisou.ma" className="text-gold hover:underline">privacy@bisou.ma</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">2. Données collectées</h2>
            <p>Nous collectons uniquement les données nécessaires à la gestion de vos commandes :</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>Nom, prénom</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de livraison (ville, rue)</li>
              <li>Produit commandé et montant</li>
              <li>Données de navigation anonymisées (Meta Pixel)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Traitement et suivi de vos commandes COD</li>
              <li>Contact téléphonique pour confirmation de livraison</li>
              <li>Amélioration de l&apos;expérience d&apos;achat (analytics)</li>
              <li>Mesure des conversions publicitaires (Meta Pixel / CAPI)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">4. Base légale</h2>
            <p>
              Conformément à la <strong className="text-cream">loi marocaine 09-08</strong> relative à la
              protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel
              et au <strong className="text-cream">RGPD</strong> (Règlement UE 2016/679) pour les ressortissants
              européens, nos traitements reposent sur l&apos;exécution du contrat de vente ou votre consentement
              explicite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">5. Durée de conservation</h2>
            <p>
              Les données de commande sont conservées pendant <strong className="text-cream">3 ans</strong>{' '}
              à compter de la dernière commande, conformément aux obligations comptables marocaines.
              Les données analytics (Meta Pixel) sont conservées selon les règles Meta (26 mois maximum).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">6. Destinataires des données</h2>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Partenaires de livraison (Amana, Glovo, Aramex, CTM) — nom + adresse + téléphone uniquement</li>
              <li>UpConfirm — pour la confirmation d&apos;appel COD</li>
              <li>Meta Platforms — analytics publicitaires (données anonymisées)</li>
              <li>Vercel / Railway — hébergement et base de données</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">7. Cookies</h2>
            <p>
              Ce site utilise le <strong className="text-cream">Meta Pixel</strong> (Facebook) pour mesurer
              l&apos;efficacité de nos publicités. Ce traceur dépose un cookie lors de votre visite. Vous pouvez
              refuser son utilisation via les paramètres de votre navigateur ou la page{' '}
              <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                Préférences publicitaires Meta
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">8. Vos droits</h2>
            <p>Conformément à la loi 09-08 et au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
              <li>Droit d&apos;opposition au traitement</li>
              <li>Droit à la portabilité des données</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href="mailto:privacy@bisou.ma" className="text-gold hover:underline">privacy@bisou.ma</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">9. Déclaration CNDP</h2>
            <p>
              BISOU Maroc a procédé aux formalités déclaratives auprès de la{' '}
              <strong className="text-cream">Commission Nationale de contrôle de la protection des Données Personnelles (CNDP)</strong>{' '}
              conformément à la loi 09-08.
            </p>
          </section>

          <p className="text-xs text-grey/60">Dernière mise à jour : janvier 2026</p>
        </div>
      </Container>
    </main>
  );
}
