/**
 * JsonLd — generic structured data injector
 * -------------------------------------------
 * Server component that renders `<script type="application/ld+json">`
 * with the given data. Used as the primitive by every specialised
 * Schema.org component in this folder (ProductSchema, ArticleSchema, etc.).
 *
 * Usage:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', ... }} />
 *
 * Security note: the JSON is serialised with `JSON.stringify` and any `<`
 * characters are escaped so they can't close the script tag.
 */

import React from 'react';

type JsonLdProps = {
  /** The JSON-LD object (or array of objects) to inject. */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Optional unique ID so multiple schemas don't collide in the DOM. */
  id?: string;
};

function escapeJsonLd(json: string): string {
  // Escape `<` to prevent early </script> termination.
  return json.replace(/</g, '\\u003c');
}

export function JsonLd({ data, id }: JsonLdProps): React.ReactElement {
  const json = escapeJsonLd(JSON.stringify(data));

  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;
