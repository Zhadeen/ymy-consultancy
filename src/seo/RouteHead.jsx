import { useLocation } from 'react-router-dom';
import Seo from './Seo';
import { ROUTE_META } from '../config/site';
import { organizationLd, webSiteLd, localBusinessLd } from './jsonLd';

// Single source of per-route <head> for pages that don't manage their own.
// Pages needing page-specific JSON-LD (FAQ, Stories, Contact, Thank-you) render
// their own <Seo>, so this skips them to avoid a double head.
const SELF_MANAGED = new Set([
  '/faq', '/stories', '/contact', '/thank-you',
  // Legal pages render their own <Seo> via LegalPage.
  '/privacy', '/terms', '/cookies', '/refunds',
]);

export default function RouteHead() {
  const { pathname } = useLocation();
  if (SELF_MANAGED.has(pathname)) return null;

  const meta = ROUTE_META[pathname];

  // Home carries the site-wide Organization / WebSite / ProfessionalService graph.
  const jsonLd = pathname === '/' ? [organizationLd(), webSiteLd(), localBusinessLd()] : [];

  if (!meta) {
    // Unknown or dynamic route (e.g. /guide/:id): keep a safe, non-indexed head
    // until/unless a page sets its own. Prevents stale titles on SPA navigation.
    return <Seo path={pathname} index={false} />;
  }

  return (
    <Seo
      title={meta.title}
      description={meta.description}
      path={pathname}
      index={meta.index !== false}
      image={meta.og}
      jsonLd={jsonLd}
    />
  );
}
