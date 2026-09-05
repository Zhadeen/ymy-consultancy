import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Visual breadcrumb trail. items = [{ name, path }], first is usually Home.
// The matching BreadcrumbList JSON-LD is emitted in the page <head> via
// <Seo jsonLd={[breadcrumbLd(items)]} /> (see seo/jsonLd.js), so structured
// data and the visible trail come from the same source.
export default function Breadcrumbs({ items = [] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-muted-dark" aria-hidden="true" />}
              {last ? (
                <span className="text-cream" aria-current="page">{it.name}</span>
              ) : (
                <Link to={it.path} className="hover:text-gold transition-colors">{it.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
