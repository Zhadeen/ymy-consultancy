import { FAQ } from '../../config/site';

// Accessible FAQ using native <details>/<summary> — keyboard-friendly and works
// even before JS hydrates (good for the prerendered page). Answers the owner
// hasn't written yet render as a clearly-marked placeholder and are OMITTED
// from the FAQPage JSON-LD (emitted separately via the page <Seo>).
export default function FAQSection({ items = FAQ, className = '' }) {
  return (
    <section className={className} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-heading text-2xl sm:text-3xl font-bold text-cream mb-6">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {items.map((f, i) => (
          <details key={i} className="card-dark group">
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 text-cream font-medium">
              <span>{f.q}</span>
              <span className="text-gold transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">+</span>
            </summary>
            <div className="px-5 pb-5 text-muted leading-relaxed">
              {f.a
                ? <p>{f.a}</p>
                : <p className="italic text-muted-dark">Answer coming soon.</p>}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
