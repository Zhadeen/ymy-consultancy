import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { createReview } from '../../infrastructure/firebase/repositories/reviewsRepository';
import { updateBooking } from '../../infrastructure/firebase/repositories/bookingsRepository';

export default function ReviewModal({ isOpen, close, booking, reviewerRole, reviewer, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setText('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !booking || !reviewer) return null;

  const isVisitorRatingGuide = reviewerRole === 'visitor';
  const targetId = isVisitorRatingGuide ? booking.guideId : booking.visitorId;
  const targetName = isVisitorRatingGuide ? booking.guideName : booking.visitorName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // 1. Add review to 'reviews' collection. When a visitor rates a guide we
      // also stamp guideId (== targetId) so the guide profile and the list
      // pages, which query/aggregate reviews by guideId, pick it up. The
      // guide's average rating is computed from these reviews at read time
      // (see domain/ratings.js) — we no longer write it back onto the guide
      // doc, which the security rules reject for a non-owner reviewer and which
      // was making every submission fail after the review had already saved.
      await createReview({
        bookingId: booking.id,
        reviewerId: reviewer.uid,
        reviewerName: reviewer.name,
        reviewerRole: reviewerRole,
        reviewerPhoto: reviewer.photo || null,
        targetId: targetId,
        targetName: targetName,
        ...(isVisitorRatingGuide ? { guideId: targetId } : {}),
        rating: rating,
        text: text,
        createdAt: serverTimestamp(),
      });

      // 2. Mark booking as reviewed
      const bookingUpdateField = isVisitorRatingGuide ? 'visitorReviewed' : 'guideReviewed';
      await updateBooking(booking.id, {
        [bookingUpdateField]: true,
        updatedAt: serverTimestamp()
      });

      if (onSuccess) onSuccess();
      close();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" onClick={close}>
      <div 
        className="card-dark w-full max-w-lg p-6 sm:p-8 animate-fade-in relative border border-gold-200/20" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={close} 
          className="absolute top-4 right-4 text-muted hover:text-cream bg-dark-700/50 hover:bg-dark-600 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="font-heading text-2xl font-bold text-cream mb-2 text-center">
          Rate Your {isVisitorRatingGuide ? 'Experience' : 'Guest'}
        </h2>
        <p className="text-muted text-sm text-center mb-8">
          How was your session with <strong className="text-gold">{targetName}</strong>?
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Star Selection */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110 p-1"
              >
                <Star 
                  size={40} 
                  className={`transition-colors duration-200 ${
                    (hoverRating || rating) >= star 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-dark-500'
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* Optional Text */}
          <div>
            <label className="block text-sm font-medium text-cream mb-2">Written Review <span className="text-muted font-normal">(Optional)</span></label>
            <textarea 
              rows={4}
              placeholder={isVisitorRatingGuide 
                ? "What did you love about your local guide? Tell future travelers!"
                : "How was the traveler? Were they respectful and on time?"}
              value={text} 
              onChange={e => setText(e.target.value)} 
              className="input-dark w-full resize-none bg-dark-700 border-dark-600 text-sm focus:border-gold"
              maxLength={500}
            />
            <div className="text-right text-xs text-muted-dark mt-1">
              {text.length}/500
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || rating === 0}
            className="btn-gold w-full mt-2 py-3 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
