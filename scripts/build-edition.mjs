import { execSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const edition = (process.env.PORTFOLIO_EDITION || 'sky-zenith').trim().toLowerCase();

const run = (cmd) => {
  console.log(`[build-edition] (${edition}) $ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

run('npx tsc -b');

if (edition === 'lumora') {
  run('npx vite build --config vite.lumora.config.ts');
  const srcHtml = resolve('dist', 'lumora.html');
  const destIndex = resolve('dist', 'index.html');
  if (!existsSync(srcHtml)) {
    throw new Error('dist/lumora.html introuvable après le build Lumora');
  }
  copyFileSync(srcHtml, destIndex);
  console.log('[build-edition] dist/lumora.html copié vers dist/index.html');
} else if (edition === 'glide') {
  run('npx vite build --config vite.glide.config.ts');
  const srcHtml = resolve('dist', 'glide.html');
  const destIndex = resolve('dist', 'index.html');
  if (!existsSync(srcHtml)) {
    throw new Error('dist/glide.html introuvable après le build Glide');
  }
  copyFileSync(srcHtml, destIndex);
  console.log('[build-edition] dist/glide.html copié vers dist/index.html');
} else {
  run('npx vite build');
  console.log('[build-edition] Édition Sky Zenith générée dans dist/index.html');
}
