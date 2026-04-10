/**
 * FAQSchema — Schema.org FAQPage JSON-LD
 * ----------------------------------------
 * Wrap a list of Q&A pairs and emit a FAQPage structured data block.
 * Google may display the Q&As as expandable rich results in SERP,
 * which massively increases CTR on long-tail informational queries.
 *
 * Usage:
 *   <FAQSchema
 *     questions={[
 *       { question: "C'est quoi l'acier 316L ?", answer: "L'acier 316L est un acier chirurgical..." },
 *       { question: "Est-ce hypoallergénique ?", answer: "Oui, il ne contient pas de nickel libre..." },
 *     ]}
 *   />
 *
 * Règles : texte brut ou HTML échappé. Max ~300 caractères par réponse
 * pour de bons résultats (Google tronque au-delà).
 */

import React from 'react';

import { JsonLd } from './JsonLd';

type FAQQuestion = {
  question: string;
  answer: string;
};

type FAQSchemaProps = {
  questions: FAQQuestion[];
  /** Optional unique id to disambiguate multiple FAQ blocks on one page. */
  id?: string;
};

export function FAQSchema({ questions, id }: FAQSchemaProps): React.ReactElement | null {
  if (!questions || questions.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} id={id ?? 'faq-jsonld'} />;
}

export default FAQSchema;
