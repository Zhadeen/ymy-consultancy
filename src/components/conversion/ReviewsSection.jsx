import { SITE } from '../../config/site';

// COLLECTION MODE: this component is wired but OFF until real reviews exist.
// It renders nothing unless SITE.reviewsEnabled is true AND real reviews are
// passed in. No Review/AggregateRating JSON-LD is emitted anywhere until then —
// see SETUP.md for how to claim a Google Business Profile and turn this on.
export default function ReviewsSection({ reviews = [] }) {
  if (!SITE.reviewsEnabled || reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-heading" className="py-4">
      <h2 id="reviews-heading" className="font-heading text-2xl font-bold text-cream mb-6">
        What travelers say
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <figure key={i} className="card-dark p-5">
            <blockquote className="text-muted leading-relaxed">“{r.text}”</blockquote>
            <figcaption className="mt-3 text-sm text-cream font-medium">
              {r.author}{r.rating ? ` · ${r.rating}★` : ''}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
