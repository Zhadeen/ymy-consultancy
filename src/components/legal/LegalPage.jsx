import Seo from '../../seo/Seo';
import { ROUTE_META } from '../../config/site';
import { LEGAL } from '../../config/legal';
import { breadcrumbLd } from '../../seo/jsonLd';
import Breadcrumbs from '../conversion/Breadcrumbs';
import DraftBanner from './DraftBanner';

// Renders a legal document from LEGAL config: DRAFT banner, title, breadcrumb,
// and sections. Owner placeholders (`[OWNER MUST PROVIDE: …]`) are highlighted so
// they're obvious and can't be mistaken for finished copy.
function renderText(text) {
  const parts = text.split(/(\[OWNER MUST PROVIDE:[^\]]*\])/g);
  return parts.map((p, i) =>
    p.startsWith('[OWNER MUST PROVIDE:')
      ? <mark key={i} className="bg-amber-500/20 text-amber-200 px-1 rounded not-italic">{p}</mark>
      : p
  );
}

export default function LegalPage({ doc, path }) {
  const meta = ROUTE_META[path];
  const crumbs = [{ name: 'Home', path: '/' }, { name: doc.title, path }];

  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <Seo
        title={meta?.title || doc.title}
        description={meta?.description || doc.subtitle}
        path={path}
        image={meta?.og}
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mt-4 mb-2">{doc.title}</h1>
        {doc.subtitle && <p className="text-muted text-lg mb-8">{doc.subtitle}</p>}

        <DraftBanner />

        <p className="text-muted-dark text-xs mb-8">Last updated: {renderText(LEGAL.lastUpdated)}</p>

        {doc.intro && <p className="text-cream/90 leading-relaxed mb-8">{renderText(doc.intro)}</p>}

        <div className="space-y-8">
          {doc.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">{s.h}</h2>
              <div className="space-y-2 text-cream/90 leading-relaxed">
                {s.body.map((b, j) => <p key={j}>{renderText(b)}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
