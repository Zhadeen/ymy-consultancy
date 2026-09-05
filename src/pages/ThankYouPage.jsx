import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, X } from 'lucide-react';
import Seo from '../seo/Seo';
import { ROUTE_META, SITE } from '../config/site';
import ResponseTimePromise from '../components/conversion/ResponseTimePromise';

const REVIEW_DISMISS_KEY = 'ymy_review_prompt_dismissed';

export default function ThankYouPage() {
  const meta = ROUTE_META['/thank-you'];
  const [reviewDismissed, setReviewDismissed] = useState(() => {
    try { return typeof localStorage !== 'undefined' && localStorage.getItem(REVIEW_DISMISS_KEY) === '1'; }
    catch { return false; }
  });

  const dismissReview = () => {
    setReviewDismissed(true);
    try { localStorage.setItem(REVIEW_DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  // Review prompt shows only when the owner has supplied a real review link.
  const showReview = SITE.reviewUrl && !reviewDismissed;

  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <Seo title={meta.title} description={meta.description} path="/thank-you" index={false} />
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-gold" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-3">Thank you</h1>
        <p className="text-muted text-lg mb-2">We've received your message and will be in touch.</p>
        <ResponseTimePromise className="mb-8 justify-center" />

        {showReview && (
          <div className="card-dark p-6 mb-8 text-left relative">
            <button
              onClick={dismissReview}
              aria-label="Dismiss review request"
              className="absolute top-3 right-3 text-muted hover:text-cream"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 mb-2 text-gold">
              <Star size={18} aria-hidden="true" /><Star size={18} aria-hidden="true" /><Star size={18} aria-hidden="true" /><Star size={18} aria-hidden="true" /><Star size={18} aria-hidden="true" />
            </div>
            <h2 className="text-cream font-semibold mb-1">Enjoyed working with us?</h2>
            <p className="text-muted text-sm mb-4">A quick review helps other travelers find great local guides.</p>
            <a href={SITE.reviewUrl} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2">
              Leave a review
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-gold px-6 py-3">Back to home</Link>
          <Link to="/search" className="btn-ghost px-6 py-3">Find a local guide</Link>
        </div>
      </div>
    </main>
  );
}
