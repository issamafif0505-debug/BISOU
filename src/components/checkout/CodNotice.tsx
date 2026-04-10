/**
 * <CodNotice />
 * -------------
 * Reassurance block explaining how the COD (cash on delivery) process
 * works. Reproduces the tone of the legacy checkout page.
 */

import type { ReactNode } from 'react';

function Bullet({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/5 text-gold">
        {icon}
      </span>
      <span className="text-sm text-cream/80">{children}</span>
    </li>
  );
}

export function CodNotice() {
  return (
    <div className="rounded-[12px] border border-gold/20 bg-gold/5 p-5">
      <h3 className="mb-3 font-serif text-lg text-gold">
        Paiement à la livraison
      </h3>
      <ul className="space-y-3">
        <Bullet
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Vous payez en espèces uniquement à la réception de votre commande.
        </Bullet>
        <Bullet
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Livraison partout au Maroc sous 48-72h.
        </Bullet>
        <Bullet
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Garantie BISOU 6 mois sur tous nos bijoux plaqués or 18K.
        </Bullet>
        <Bullet
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Vous recevrez un appel de confirmation avant expédition.
        </Bullet>
      </ul>
    </div>
  );
}

export default CodNotice;
