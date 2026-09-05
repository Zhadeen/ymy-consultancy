// Post-build static prerender.
//
// Runs after `vite build` (client → dist/) and `vite build --ssr` (server →
// dist-ssr/entry-server.js). For each public route it renders the app to HTML,
// serialises the <head> the <Seo> components collected, injects both into the
// built index.html template, and writes dist/<route>/index.html. Also emits a
// real 404.html and sitemap.xml.
//
// This replaces vite-react-ssg, which is incompatible with React Router 7.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js');
const SITE_ORIGIN = 'https://www.ymycons.com';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headToHtml(head) {
  const tags = [];
  if (head.title) tags.push(`<title>${esc(head.title)}</title>`);
  if (head.description) tags.push(`<meta name="description" content="${esc(head.description)}">`);
  if (head.canonical) tags.push(`<link rel="canonical" href="${esc(head.canonical)}">`);
  if (head.robots) tags.push(`<meta name="robots" content="${esc(head.robots)}">`);
  if (head.ogTitle) tags.push(`<meta property="og:title" content="${esc(head.ogTitle)}">`);
  if (head.ogDescription) tags.push(`<meta property="og:description" content="${esc(head.ogDescription)}">`);
  if (head.ogUrl) tags.push(`<meta property="og:url" content="${esc(head.ogUrl)}">`);
  tags.push('<meta property="og:type" content="website">');
  tags.push('<meta property="og:site_name" content="YMY Consultancy">');
  if (head.ogImage) tags.push(`<meta property="og:image" content="${esc(head.ogImage)}">`);
  tags.push(`<meta name="twitter:card" content="${head.ogImage ? 'summary_large_image' : 'summary'}">`);
  if (head.ogTitle) tags.push(`<meta name="twitter:title" content="${esc(head.ogTitle)}">`);
  if (head.ogDescription) tags.push(`<meta name="twitter:description" content="${esc(head.ogDescription)}">`);
  if (head.ogImage) tags.push(`<meta name="twitter:image" content="${esc(head.ogImage)}">`);
  for (const block of head.jsonLd || []) {
    // Escape </script> to avoid breaking out of the tag.
    const json = JSON.stringify(block).replace(/<\/(script)/gi, '<\\/$1');
    tags.push(`<script type="application/ld+json" data-seo-jsonld>${json}</script>`);
  }
  return tags.join('\n    ');
}

function buildPage(template, html, head) {
  return template
    // Remove the default title / description so per-route ones are authoritative.
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/i, '')
    .replace('<!--app-head-->', headToHtml(head))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

function writeFile(routePath, contents) {
  const outPath =
    routePath === '/' ? join(distDir, 'index.html') : join(distDir, routePath, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, contents);
  return outPath.replace(root + '/', '');
}

async function main() {
  const template = readFileSync(join(distDir, 'index.html'), 'utf8');
  const { render, routes } = await import(pathToFileURL(ssrEntry).href);

  const indexable = [];
  let ok = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const { html, head } = render(route);
      const page = buildPage(template, html, head);
      const written = writeFile(route, page);
      const noindex = (head.robots || '').includes('noindex');
      if (!noindex) indexable.push(route);
      console.log(`  ✓ ${route.padEnd(18)} -> ${written}${noindex ? '  (noindex)' : ''}`);
      ok++;
    } catch (err) {
      failed++;
      console.error(`  ✗ ${route} — prerender failed: ${err.message}`);
    }
  }

  // Real 404: render the catch-all route to a true 404.html (Vercel serves it
  // with a 404 status via vercel.json).
  try {
    const { html, head } = render('/__not_found__');
    writeFileSync(join(distDir, '404.html'), buildPage(template, html, { ...head, robots: 'noindex,follow' }));
    console.log('  ✓ 404               -> dist/404.html');
  } catch (err) {
    console.error(`  ✗ 404.html — ${err.message}`);
  }

  // Blank SPA shell for client-only routes (/search, /guide/:id, dashboards…).
  // These are NOT prerendered, so they must load an EMPTY #root — serving the
  // home prerender instead would hydrate-mismatch. vercel.json rewrites the
  // client routes here. A generic brand head applies before JS sets the real one.
  const shellHead = [
    '<title>YMY Consultancy — Premium Tour Guide Booking</title>',
    '<meta name="description" content="Book verified, independent local guides worldwide for private, authentic experiences.">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="YMY Consultancy">',
    `<meta property="og:image" content="${SITE_ORIGIN}/og/home.png">`,
  ].join('\n    ');
  const shell = template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/i, '')
    .replace('<!--app-head-->', shellHead);
  writeFileSync(join(distDir, 'app.html'), shell);
  console.log('  ✓ app.html          -> SPA shell for client-only routes');

  // sitemap.xml — indexable prerendered routes only.
  const urls = indexable
    .map((r) => `  <url><loc>${SITE_ORIGIN}${r === '/' ? '/' : r}</loc></url>`)
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
  console.log(`  ✓ sitemap.xml       -> ${indexable.length} urls`);

  // Clean up the SSR bundle (not part of the deployed output).
  try { rmSync(join(root, 'dist-ssr'), { recursive: true, force: true }); } catch { /* ignore */ }

  console.log(`\nPrerender complete: ${ok} routes, ${failed} failed.`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => { console.error(err); process.exit(1); });
