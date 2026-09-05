import { useEffect } from 'react';
import { useHeadCollector } from './headContext';
import { SITE } from '../config/site';

const JSONLD_MARK = 'data-seo-jsonld';

function upsertMeta(attr, key, value) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!value) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}

function upsertLink(rel, href) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!href) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

function replaceJsonLd(blocks) {
  if (typeof document === 'undefined') return;
  document.head.querySelectorAll(`script[${JSONLD_MARK}]`).forEach((n) => n.remove());
  blocks.forEach((obj) => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute(JSONLD_MARK, '');
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  });
}

// Per-route <head>. Pass a page title (brand suffix is added), description,
// canonical path, whether to index, an OG image path, and any JSON-LD blocks.
export default function Seo({
  title,
  description,
  path = '/',
  index = true,
  image,
  jsonLd = [],
}) {
  const collector = useHeadCollector();
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const desc = description || SITE.description;
  const url = SITE.url + (path === '/' ? '' : path);
  const ogImage = image ? (image.startsWith('http') ? image : SITE.url + image) : null;
  const robots = index ? 'index,follow' : 'noindex,follow';
  const blocks = (jsonLd || []).filter(Boolean);

  // SERVER (prerender): write into the collector during render.
  if (collector) {
    collector.title = fullTitle;
    collector.description = desc;
    collector.canonical = url;
    collector.robots = robots;
    collector.ogTitle = fullTitle;
    collector.ogDescription = desc;
    collector.ogUrl = url;
    collector.ogImage = ogImage;
    collector.jsonLd = (collector.jsonLd || []).concat(blocks);
  }

  // CLIENT: apply on mount and whenever the key inputs change.
  useEffect(() => {
    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', robots);
    upsertLink('canonical', url);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);
    replaceJsonLd(blocks);
    // blocks is derived fresh each render; stringify guards against needless work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullTitle, desc, url, robots, ogImage, JSON.stringify(blocks)]);

  return null;
}
