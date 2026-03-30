import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Languages, Calendar, Clock, BadgeCheck, Award, MessageSquare, ChevronLeft, ChevronRight, Star, Users } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import StarRating from '../components/common/StarRating';
import ScrollReveal from '../components/common/ScrollReveal';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import TouristPricingModal from '../components/TouristPricingModal';

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
        const docRef = doc(db, 'guides', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuide({ id: docSnap.id, ...docSnap.data() });
          
          // Fetch Reviews for this guide
          const reviewsQ = query(
            collection(db, 'reviews'), 
            where('guideId', '==', id),
            orderBy('createdAt', 'desc')
          );
          const reviewsSnap = await getDocs(reviewsQ);
          setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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
          <h2 className="font-heading text-3xl text-cream mb-4">Guide Not Found</h2>
          <Link to="/search" className="btn-gold">Back to Search</Link>
        </div>
      </main>
    );
  }

  const handleBook = () => {
    if (user?.role === 'tourist' && !user?.isSubscribed) {
      setShowPaywall(true);
      return;
    }
    updateBooking({ guideId: guide.id, guideName: guide.name });
    navigate(`/booking/${guide.id}`);
  };

  const handleMessage = () => {
    if (user?.role === 'tourist' && !user?.isSubscribed) {
      setShowPaywall(true);
      return;
    }
    navigate(`/chat/${guide.id}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const reviewData = {
        guideId: id,
        touristId: user.uid,
        touristName: user.name,
        rating: newRating,
        text: newText,
        createdAt: serverTimestamp(),
        date: new Date().toISOString() // Fallback literal date
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      setReviews(prev => [{ id: docRef.id, ...reviewData }, ...prev]);
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

  // Calendar helpers
  const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calMonth.year, calMonth.month, 1).getDay();
  const monthName = new Date(calMonth.year, calMonth.month).toLocaleDateString('en', { month: 'long', year: 'numeric' });

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

  const isAvailable = (day) => {
    if (!guide || !guide.availability) return true;
    const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return guide.availability[dateStr];
  };

  const formatList = (item) => {
    if (!item) return [];
    if (Array.isArray(item)) return item;
    if (typeof item === 'string') return item.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      {/* Hero */}
      <div className="relative bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/search" className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors mb-8">
            <ChevronLeft size={16} />
            <span className="text-sm">Back to Search</span>
          </Link>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Photo */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="relative">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-dark-500"
                />
                {guide.idVerified && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gold rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-gold-glow">
                    <BadgeCheck size={16} className="text-dark-900" />
                    <span className="text-dark-900 text-sm font-bold">ID Verified Guide</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream mb-2">
                {guide.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {guide.country}, {guide.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {guide.experience} years experience
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={16} />
                  {guide.totalBookings} tours completed
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={guide.rating} size={18} />
                <span className="text-muted text-sm">({guide.reviewCount} reviews)</span>
              </div>

              <p className="text-cream/80 leading-relaxed mb-8 text-lg">{guide.bio}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {formatList(guide.languages).map(lang => (
                  <span key={lang} className="bg-dark-700 border border-dark-500 rounded-full px-4 py-1.5 text-sm text-cream flex items-center gap-1.5">
                    <Languages size={14} className="text-gold" />
                    {lang}
                  </span>
                ))}
                {formatList(guide.specialties).map(spec => (
                  <span key={spec} className="bg-gold-100 border border-gold-200 rounded-full px-4 py-1.5 text-sm text-gold flex items-center gap-1.5">
                    <Award size={14} />
                    {spec}
                  </span>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="lg:hidden flex gap-3">
                {guide.isSubscribed ? (
                  <button onClick={handleBook} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    <Calendar size={18} />
                    Book This Guide
                  </button>
                ) : (
                  <button disabled className="btn-ghost flex-1 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed" title="Guide subscription inactive">
                    <Calendar size={18} />
                    Unavailable
                  </button>
                )}
                <Link to="#" onClick={(e) => { e.preventDefault(); handleMessage(); }} className="btn-ghost flex items-center gap-2 !px-4 hover:text-gold transition-colors">
                  <MessageSquare size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Pricing */}
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Half Day', sublabel: '4 hours', price: guide.priceHalfDay },
                  { label: 'Full Day', sublabel: '8 hours', price: guide.priceFullDay, popular: true },
                  { label: 'Custom', sublabel: 'Per hour', price: guide.priceCustom },
                ].map(tier => (
                  <div
                    key={tier.label}
                    className={`card-dark p-6 text-center relative ${tier.popular ? 'border-gold' : ''}`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <h3 className="font-heading text-lg text-cream font-semibold">{tier.label}</h3>
                    <p className="text-muted-dark text-xs mt-1">{tier.sublabel}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-heading font-bold text-gold">${tier.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Availability Calendar */}
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">Availability</h2>
              <div className="card-dark p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <h3 className="font-heading text-lg text-cream font-semibold">{monthName}</h3>
                  <button onClick={nextMonth} className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs text-muted-dark py-2 font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfWeek }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const available = isAvailable(day);
                    return (
                      <div
                        key={day}
                        className={`text-center py-2.5 rounded-lg text-sm transition-all cursor-default ${
                          available
                            ? 'bg-gold-100 text-gold font-semibold hover:bg-gold-200'
                            : 'text-muted-dark'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dark-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gold-100" />
                    <span className="text-xs text-muted">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-dark-600" />
                    <span className="text-xs text-muted">Unavailable</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Reviews */}
            <ScrollReveal>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-cream">
                  Reviews <span className="text-muted text-lg font-normal">({reviews.length})</span>
                </h2>
                {user && user.role === 'tourist' && !showReviewForm && (
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
                  <form onSubmit={handleSubmitReview}>
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
                          <h4 className="text-cream font-semibold">{review.touristName}</h4>
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
          </div>

          {/* Sticky Sidebar CTA */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-28">
              <div className="card-dark p-6 border-gold-200">
                <div className="text-center mb-6">
                  <span className="text-3xl font-heading font-bold text-gold">${guide.priceFullDay}</span>
                  <span className="text-muted text-sm"> / day</span>
                </div>

                {guide.isSubscribed ? (
                  <button
                    onClick={handleBook}
                    id="book-guide-btn"
                    className="btn-gold w-full flex items-center justify-center gap-2 text-lg !py-4 animate-pulse-gold min-h-[60px]"
                  >
                    <Calendar size={20} />
                    Book This Guide
                  </button>
                ) : (
                  <div className="bg-dark-600 border border-dark-500 rounded-xl p-4 text-center min-h-[60px] flex flex-col justify-center">
                    <p className="text-muted text-sm flex items-center justify-center gap-2 font-medium">
                      <Calendar size={16} /> Unavailable to Book
                    </p>
                  </div>
                )}

                <button
                  onClick={handleMessage}
                  className="btn-ghost w-full flex items-center justify-center gap-2 mt-3"
                >
                  <MessageSquare size={18} />
                  Send Message
                </button>

                <div className="mt-6 pt-6 border-t border-dark-600 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Response time</span>
                    <span className="text-cream font-medium">Under 1 hour</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Cancellation</span>
                    <span className="text-cream font-medium">Free up to 48h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Languages</span>
                    <span className="text-cream font-medium">{(guide.languages || []).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <TouristPricingModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </main>
  );
}
