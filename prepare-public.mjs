import { mkdir, rm, readdir, copyFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, 'public');
const exclude = new Set([
  'public','node_modules','.git','.github',
  'worker.js','wrangler.jsonc','package.json','bun.lockb','package-lock.json',
  'prepare-public.mjs','README.md','.gitignore'
]);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const name of await readdir(root)) {
  if (exclude.has(name)) continue;
  const src = join(root, name);
  const info = await stat(src);
  if (!info.isFile()) continue;
  const ext = name.toLowerCase().split('.').pop();
  if (!['html','css','js','json','jpg','jpeg','png','webp','svg','ico','txt'].includes(ext)) continue;
  await copyFile(src, join(out, name));
}
console.log('public/ generado automáticamente para Cloudflare Workers Static Assets');
