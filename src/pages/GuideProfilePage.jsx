import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Languages, Calendar, Clock, BadgeCheck, Award, MessageSquare, ChevronLeft, ChevronRight, Star, Users } from 'lucide-react';
import { mockReviews } from '../data/mockData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import StarRating from '../components/common/StarRating';
import ScrollReveal from '../components/common/ScrollReveal';
import { useBooking } from '../context/BookingContext';

export default function GuideProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const reviews = mockReviews.filter(r => r.guideId === id);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const docRef = doc(db, 'guides', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuide({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching guide:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
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
    updateBooking({ guideId: guide.id, guideName: guide.name });
    navigate(`/booking/${guide.id}`);
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
                {(guide.languages || []).map(lang => (
                  <span key={lang} className="bg-dark-700 border border-dark-500 rounded-full px-4 py-1.5 text-sm text-cream flex items-center gap-1.5">
                    <Languages size={14} className="text-gold" />
                    {lang}
                  </span>
                ))}
                {(guide.specialties || []).map(spec => (
                  <span key={spec} className="bg-gold-100 border border-gold-200 rounded-full px-4 py-1.5 text-sm text-gold flex items-center gap-1.5">
                    <Award size={14} />
                    {spec}
                  </span>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="lg:hidden flex gap-3">
                <button onClick={handleBook} className="btn-gold flex-1 flex items-center justify-center gap-2">
                  <Calendar size={18} />
                  Book This Guide
                </button>
                <button className="btn-ghost flex items-center gap-2 !px-4">
                  <MessageSquare size={18} />
                </button>
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
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">
                Reviews <span className="text-muted text-lg font-normal">({guide.reviewCount})</span>
              </h2>
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review, i) => (
                  <ScrollReveal key={review.id} delay={i * 60}>
                    <div className="card-dark p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-cream font-semibold">{review.touristName}</h4>
                          <p className="text-muted-dark text-xs">{new Date(review.date).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
                        </div>
                        <StarRating rating={review.rating} size={14} showValue={false} />
                      </div>
                      <p className="text-cream/80 text-sm leading-relaxed">{review.text}</p>
                    </div>
                  </ScrollReveal>
                )) : (
                  <p className="text-muted text-center py-8">No reviews yet.</p>
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

                <button
                  onClick={handleBook}
                  id="book-guide-btn"
                  className="btn-gold w-full flex items-center justify-center gap-2 text-lg !py-4 animate-pulse-gold"
                >
                  <Calendar size={20} />
                  Book This Guide
                </button>

                <Link
                  to={`/chat/${guide.id}`}
                  className="btn-ghost w-full flex items-center justify-center gap-2 mt-3"
                >
                  <MessageSquare size={18} />
                  Send Message
                </Link>

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
    </main>
  );
}
