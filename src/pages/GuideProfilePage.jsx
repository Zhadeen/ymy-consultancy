import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { serverTimestamp } from 'firebase/firestore';
import { getGuideById } from '../infrastructure/firebase/repositories/guidesRepository';
import { createReview, getReviewsByGuideId } from '../infrastructure/firebase/repositories/reviewsRepository';
import { computeRating } from '../domain/ratings';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import VisitorPricingModal from '../components/VisitorPricingModal';
import ProfileHero from './guide-profile/ProfileHero';
import PricingSection from './guide-profile/PricingSection';
import AvailabilityCalendar from './guide-profile/AvailabilityCalendar';
import ReviewsSection from './guide-profile/ReviewsSection';
import BookingSidebar from './guide-profile/BookingSidebar';

export default function GuideProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Guide
        const guideData = await getGuideById(id);
        if (guideData) {
          setGuide(guideData);

          // Fetch Reviews for this guide
          const reviewsData = await getReviewsByGuideId(id);
          setReviews(reviewsData);
        } else {
          console.warn("Guide not found in Firestore:", id);
        }
      } catch (err) {
        console.error("Error fetching guide/reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-dark-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </main>
    );
  }

  if (!guide) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-dark-800">
        <div className="text-center">
          <h2 className="font-heading text-3xl text-cream mb-4">Local Guide Not Found</h2>
          <Link to="/search" className="btn-gold">Back to Search</Link>
        </div>
      </main>
    );
  }

  // Rating shown on the profile is computed from the loaded reviews, not the
  // guide document. A guide with no reviews yet keeps its stored default.
  const { rating: computedRating, reviewCount: computedCount } = computeRating(reviews);
  const displayGuide = computedCount > 0
    ? { ...guide, rating: computedRating, reviewCount: computedCount }
    : guide;

  // Detect if the logged-in user is viewing their OWN guide profile
  const isOwnProfile = user && guide && user.uid === guide.uid;

  // Same 90-day-trial-or-subscribed check used by both the mobile CTA and the sticky sidebar CTA.
  const createdAt = guide.createdAt?.toDate ? guide.createdAt.toDate() : new Date(guide.createdAt || Date.now());
  const trialEnd = new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000);
  const isTrialActive = trialEnd > new Date();
  const isBookable = guide.isSubscribed || isTrialActive;

  const handleBook = () => {
    if (isOwnProfile) return; // Guard: can't book yourself
    if (!user) {
      setShowPaywall(true);
      return;
    }
    updateBooking({ guideId: guide.id, guideName: guide.name });
    navigate(`/booking/${guide.id}`);
  };

  const handleMessage = () => {
    if (isOwnProfile) return; // Guard: can't message yourself
    if (!user) {
      setShowPaywall(true);
      return;
    }
    navigate(`/chat/${guide.uid}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const reviewData = {
        guideId: id,
        visitorId: user.uid,
        visitorName: user.name,
        rating: newRating,
        text: newText,
        createdAt: serverTimestamp(),
        date: new Date().toISOString() // Fallback literal date
      };

      const reviewId = await createReview(reviewData);
      setReviews(prev => [{ id: reviewId, ...reviewData }, ...prev]);
      setNewText('');
      setNewRating(5);
      setShowReviewForm(false);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const prevMonth = () => {
    setCalMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };
  const nextMonth = () => {
    setCalMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      <ProfileHero guide={displayGuide} isOwnProfile={isOwnProfile} isBookable={isBookable} onBook={handleBook} onMessage={handleMessage} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            <PricingSection guide={guide} />

            <AvailabilityCalendar guide={guide} calMonth={calMonth} onPrevMonth={prevMonth} onNextMonth={nextMonth} />

            <ReviewsSection
              reviews={reviews}
              user={user}
              showReviewForm={showReviewForm}
              setShowReviewForm={setShowReviewForm}
              newRating={newRating}
              setNewRating={setNewRating}
              newText={newText}
              setNewText={setNewText}
              submitting={submitting}
              onSubmitReview={handleSubmitReview}
            />
          </div>

          <BookingSidebar guide={guide} isOwnProfile={isOwnProfile} isBookable={isBookable} onBook={handleBook} onMessage={handleMessage} />
        </div>
      </div>

      <VisitorPricingModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </main>
  );
}
