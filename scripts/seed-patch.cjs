/**
 * Seed bootstrap — runs via NODE_OPTIONS="--require ./scripts/seed-patch.cjs"
 * BEFORE any module (including tsx/esbuild) loads.
 *
 * Does two things in strict order:
 *  1. Loads .env.local / .env into process.env (so DATABASE_URI is available
 *     when payload.config.ts is first evaluated — before any import runs).
 *  2. Patches @next/env for ESM/CJS interop with TSX.
 *     TSX (esbuild) transforms `import X from '@next/env'` to:
 *       const X = require('@next/env').default
 *     But @next/env v15 exports via `module.exports = n` where n.__esModule = true
 *     but n.default is undefined. This patch adds n.default = n so the interop works.
 */
const fs = require('fs');
const path = require('path');

// ── 1. Load .env.local / .env ───────────────────────────────────────────────
for (const envFile of ['.env.local', '.env']) {
  const p = path.resolve(process.cwd(), envFile);
  if (!fs.existsSync(p)) continue;
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
  break; // Stop after the first env file found (.env.local takes priority)
}

// Tell Payload/Next.js that env was already loaded — skip their own loader.
process.env['__NEXT_PROCESSED_ENV'] = 'true';

// ── 2. Patch @next/env for ESM/CJS interop ──────────────────────────────────
const Module = require('module');
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  const exports = originalLoad.apply(this, arguments);
  if (
    typeof request === 'string' &&
    request.includes('@next/env') &&
    exports &&
    typeof exports === 'object' &&
    exports.loadEnvConfig &&
    !exports.default
  ) {
    exports.default = exports;
  }
  return exports;
};
