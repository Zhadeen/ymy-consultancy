import { MessageSquare, Star } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import StarRating from '../../components/common/StarRating';

export default function ReviewsSection({
  reviews, user, showReviewForm, setShowReviewForm,
  newRating, setNewRating, newText, setNewText,
  submitting, onSubmitReview
}) {
  return (
    <ScrollReveal>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-cream">
          Reviews <span className="text-muted text-lg font-normal">({reviews.length})</span>
        </h2>
        {user && user.role === 'visitor' && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="text-gold text-sm font-semibold hover:underline"
          >
            + Write a Review
          </button>
        )}
      </div>

      {/* Add Review Form */}
      {showReviewForm && (
        <div className="card-dark p-6 mb-8 border-gold/30 animate-fade-in">
          <h3 className="text-cream font-bold mb-4">Share your experience</h3>
          <form onSubmit={onSubmitReview}>
            <div className="mb-4">
              <label className="text-muted text-xs block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`p-1 transition-colors ${newRating >= star ? 'text-gold' : 'text-dark-500'}`}
                  >
                    <Star size={24} fill={newRating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="text-muted text-xs block mb-2">Work with this guide? Tell us how it was.</label>
              <textarea
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Write your review here..."
                className="input-dark min-h-[120px] resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold !py-2.5 !px-8"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="text-muted hover:text-cream text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? reviews.map((review, i) => (
          <ScrollReveal key={review.id} delay={i * 60}>
            <div className="card-dark p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-cream font-semibold">{review.visitorName}</h4>
                  <p className="text-muted-dark text-xs">
                    {review.createdAt?.toDate
                      ? review.createdAt.toDate().toLocaleDateString('en', { month: 'long', year: 'numeric' })
                      : new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <StarRating rating={review.rating} size={14} showValue={false} />
              </div>
              <p className="text-cream/80 text-sm leading-relaxed">{review.text}</p>
            </div>
          </ScrollReveal>
        )) : (
          <div className="text-center py-12 card-dark bg-dark-700/30 border-dashed">
            <MessageSquare size={32} className="text-muted-dark mx-auto mb-3" />
            <p className="text-muted">No reviews yet for this guide.</p>
            <p className="text-xs text-muted-dark mt-1">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
