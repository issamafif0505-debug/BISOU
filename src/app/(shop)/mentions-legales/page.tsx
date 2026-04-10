import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales BISOU Maroc — informations légales, hébergeur, responsable de publication.',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-black pb-24">
      <BreadcrumbSchema
        items={[{ name: 'Accueil', url: '/' }, { name: 'Mentions légales' }]}
      />

      <Container className="max-w-3xl pt-8">
        <h1 className="font-serif text-3xl md:text-4xl text-cream font-light mt-4 mb-10">
          Mentions légales
        </h1>

        <div className="flex flex-col gap-10 font-sans text-grey text-sm leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-cream mb-3">Éditeur du site</h2>
            <p><strong className="text-cream">BISOU Maroc</strong></p>
            <p>Boutique de bijoux plaqués or</p>
            <p>Adresse : Marrakech, Maroc</p>
            <p>E-mail : <a href="mailto:contact@bisou.ma" className="text-gold hover:underline">contact@bisou.ma</a></p>
            <p className="mt-3 text-xs text-grey/60">
              ICE et Registre du Commerce : en cours d&apos;enregistrement (2026)
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">Responsable de publication</h2>
            <p>BISOU Maroc — contact@bisou.ma</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">Hébergement</h2>
            <p>
              <strong className="text-cream">Vercel Inc.</strong><br />
              340 Pine Street, Suite 701, San Francisco, CA 94104, USA<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">vercel.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur le site bisou.ma (textes, images, logos, design, code) sont
              protégés par le droit marocain de la propriété intellectuelle. Toute reproduction totale ou
              partielle sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">Cookies & traceurs</h2>
            <p>
              Ce site utilise des cookies à des fins d&apos;analyse d&apos;audience (Meta Pixel) et d&apos;amélioration de
              l&apos;expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies.
              Consultez notre <a href="/politique-confidentialite" className="text-gold hover:underline">politique de confidentialité</a> pour en savoir plus.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream mb-3">Droit applicable</h2>
            <p>
              Le présent site est soumis au droit marocain. Tout litige relatif à son utilisation sera porté
              devant les tribunaux compétents de Marrakech.
            </p>
          </section>

          <p className="text-xs text-grey/60">Dernière mise à jour : janvier 2026</p>
        </div>
      </Container>
    </main>
  );
}
