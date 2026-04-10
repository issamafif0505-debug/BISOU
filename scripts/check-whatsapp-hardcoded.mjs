#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// BISOU — CI check : pas de numero WhatsApp hardcode en dehors
// de src/lib/whatsapp.ts. Sortie code 1 en cas de violation.
// ─────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SRC_DIRS = ['src', 'middleware.ts', 'next.config.mjs'];
const ALLOWED = new Set([
  ['src', 'lib', 'whatsapp.ts'].join(sep),
  ['src', 'lib', 'whatsapp-client.ts'].join(sep),
]);

const PATTERNS = [
  /212600000000/,
  /wa\.me\//,
];

const IGNORED_DIRS = new Set(['node_modules', '.next', 'legacy', 'docs', '.git']);
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

let violations = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (EXTENSIONS.has(fullPath.slice(fullPath.lastIndexOf('.')))) {
      check(fullPath);
    }
  }
}

function check(file) {
  const rel = relative(ROOT, file);
  if (ALLOWED.has(rel)) return;
  const content = readFileSync(file, 'utf8');
  for (const pattern of PATTERNS) {
    if (pattern.test(content)) {
      console.error(`  [WA] ${rel} matches ${pattern}`);
      violations += 1;
    }
  }
}

for (const target of SRC_DIRS) {
  const abs = join(ROOT, target);
  try {
    const stat = statSync(abs);
    if (stat.isDirectory()) walk(abs);
    else check(abs);
  } catch {
    /* ignore missing */
  }
}

if (violations > 0) {
  console.error(`\nFAIL: ${violations} occurrence(s) de WhatsApp hardcode hors src/lib/whatsapp.ts`);
  process.exit(1);
}

console.log('OK: aucune occurrence de WhatsApp hardcode');
