import Seo from '../seo/Seo';
import { ROUTE_META, STORIES } from '../config/site';
import { breadcrumbLd } from '../seo/jsonLd';
import Breadcrumbs from '../components/conversion/Breadcrumbs';
import CTA from '../components/conversion/CTA';

const CRUMBS = [{ name: 'Home', path: '/' }, { name: 'Stories', path: '/stories' }];

// Case-study / "stories" section. Renders only stories the owner has filled in
// and marked published. No invented outcomes or quotes — until real ones exist,
// the page shows an honest empty state and the template structure below is what
// each published story will use.
export default function StoriesPage() {
  const meta = ROUTE_META['/stories'];
  const published = STORIES.filter((s) => s.published && s.title);

  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <Seo title={meta.title} description={meta.description} path="/stories" image={meta.og} jsonLd={[breadcrumbLd(CRUMBS)]} />
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mt-4 mb-4">
          Traveler stories &amp; featured guides
        </h1>
        <p className="text-muted text-lg mb-10 max-w-2xl">
          Real experiences booked through YMY — the guides who led them and the trips travelers took.
        </p>

        {published.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {published.map((s) => (
              <article key={s.id} className="card-dark overflow-hidden flex flex-col">
                {s.image && (
                  <img src={s.image} alt={`${s.title} — a guided experience with ${s.guideName || 'a local guide'}`} className="w-full h-44 object-cover" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-heading text-lg font-bold text-cream mb-1">{s.title}</h2>
                  {(s.guideName || s.location) && (
                    <p className="text-xs text-gold mb-3">
                      {[s.guideName, s.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {s.summary && <p className="text-muted text-sm leading-relaxed flex-1">{s.summary}</p>}
                  {s.quote && <blockquote className="mt-4 text-cream/90 text-sm italic border-l-2 border-gold pl-3">“{s.quote}”</blockquote>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card-dark p-10 text-center">
            <p className="text-cream text-lg mb-2">Stories are coming soon.</p>
            <p className="text-muted text-sm max-w-md mx-auto">
              We're gathering experiences from real bookings. In the meantime, browse verified
              local guides and book your own.
            </p>
          </div>
        )}

        <div className="mt-12">
          <CTA align="left" />
        </div>
      </div>
    </main>
  );
}
