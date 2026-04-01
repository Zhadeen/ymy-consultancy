import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, Clock, ChevronLeft, CreditCard, CheckCircle2, MapPin, Copy, Mail, Phone, Info, Star } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { VISIT_PURPOSES, LOCAL_EXPERIENCES } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/common/ScrollReveal';
import { getGuideLocalTime } from '../utils/timeUtils';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { booking, updateBooking, createBookingRequest, confirmed } = useBooking();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const docRef = doc(db, 'guides', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuide({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching guide for booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?redirect=/booking/${id}`);
    }
  }, [user, loading, navigate, id]);

  const [date, setDate] = useState('');
  const [tourType, setTourType] = useState('full');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [localExperience, setLocalExperience] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);



  const tourTypes = [
    { value: 'half', label: 'Half Day', sublabel: '4 hours', icon: '🌤️' },
    { value: 'full', label: 'Full Day', sublabel: '8 hours', icon: '☀️' },
    { value: 'custom', label: 'Custom', sublabel: 'Flexible', icon: '✨' },
  ];

  const availableDates = useMemo(() => {
    if (!guide) return [];
    
    const today = new Date();
    // Get local date string YYYY-MM-DD
    const getLocalDateString = (dateObj) => {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const minDate = getLocalDateString(today);

    // If guide has specific availability set, use it but filter out past dates
    const configuredDates = guide.availability && Object.keys(guide.availability).length > 0
      ? Object.entries(guide.availability)
          .filter(([dateStr, isAvailable]) => isAvailable && dateStr >= minDate)
          .map(([dateStr]) => dateStr)
          .sort()
      : [];
    
    // If there ARE valid specific dates, return them
    if (configuredDates.length > 0) {
      return configuredDates;
    }
    
    // Fallback: Default to next 30 days if no availability is explicitly set or all set dates are in the past
    const fallbackDates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      fallbackDates.push(getLocalDateString(d));
    }
    return fallbackDates;
  }, [guide]);

  const priceMap = useMemo(() => ({
    half: guide?.priceHalfDay || 0,
    full: guide?.priceFullDay || 0,
    custom: (guide?.priceCustom || 0) * 4
  }), [guide]);

  const basePrice = priceMap[tourType] || 0;
  const totalPrice = basePrice * guests;

  const handleConfirm = async () => {
    if (!date || !name || !email) return;
    setProcessing(true);
    setError(null);
    try {
      const bookingData = {
        guideName: guide.name,
        guideId: guide.id,
        guidePhoto: guide.photo,
        totalPrice,
        date,
        tourType,
        guests,
        visitorName: name,
        visitorEmail: email,
        visitorId: user.uid,
        visitPurpose,
        localExperience,
        specialRequests,
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingData, userId: user.uid }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.message || 'Failed to initialize payment.');
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setError(err.message || 'Failed to process booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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

  if (confirmed) {
    return (
      <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center p-4">
        <ScrollReveal>
          <div className="card-dark max-w-lg w-full p-8 text-center border-gold-200">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-cream mb-2">Booking Confirmed!</h1>
            <p className="text-muted mb-8 text-sm">
              Your booking with <span className="text-cream font-medium">{confirmed.guideName}</span> on {new Date(confirmed.date).toLocaleDateString()} has been successfully processed.
            </p>

            <div className="bg-dark-900 rounded-xl p-6 mb-8 text-left border border-dark-600/50">
              <h3 className="text-gold font-heading font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} /> Payment Received
              </h3>
              <p className="text-cream text-sm mb-4 leading-relaxed">
                Your payment of <span className="text-gold font-bold">${totalPrice}</span> was successful. The Local Guide has been notified.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link to={`/chat/${confirmed.guideId}`} className="btn-gold w-full flex items-center justify-center gap-2">
                Chat with Local Guide
              </Link>
              <Link to="/dashboard" className="text-muted hover:text-cream text-sm font-medium">
                Go to Visitor Dashboard
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/guide/${guide.id}`} className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors mb-8">
          <ChevronLeft size={16} />
          <span className="text-sm">Back to {guide.name}'s Profile</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Form */}
          <div className="flex-1 space-y-8">
            <ScrollReveal>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">
                Book Your Local Guide Experience
              </h1>
              <div className="flex items-center gap-3 text-muted">
                <img src={guide.photo} alt={guide.name} className="w-10 h-10 rounded-full object-cover border border-dark-500" />
                <div>
                  <span className="text-cream font-medium">{guide.name}</span>
                  <div className="flex items-center gap-3 text-xs mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={12} />{guide.city}</span>
                    <span className="flex items-center gap-1 text-gold"><Clock size={12} /> {getGuideLocalTime(guide.country)} (Local Time)</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Date */}
            <ScrollReveal delay={80}>
              <label className="block">
                <span className="text-cream font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-gold" />
                  Select Date
                </span>
                {availableDates.length > 0 ? (
                  <select value={date} onChange={e => setDate(e.target.value)} className="input-dark mt-2" id="booking-date">
                    <option value="">Choose an available date</option>
                    {availableDates.map(d => {
                      // Parse correctly without timezone shift
                      const [year, month, day] = d.split('-').map(Number);
                      const localDateObj = new Date(year, month - 1, day);
                      return (
                        <option key={d} value={d}>
                          {localDateObj.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="bg-dark-600 border border-dark-500 rounded-xl p-4 text-center mt-2">
                    <p className="text-muted text-sm">This guide is fully booked or no dates are currently available.</p>
                  </div>
                )}
              </label>
            </ScrollReveal>

            {/* Tour Type */}
            <ScrollReveal delay={160}>
              <span className="text-cream font-semibold mb-3 flex items-center gap-2">
                <Clock size={18} className="text-gold" />
                Tour Type
              </span>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {tourTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setTourType(type.value)}
                    className={`card-dark p-4 text-center transition-all duration-300 cursor-pointer ${
                      tourType === type.value ? 'border-gold bg-gold-50' : ''
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-cream font-semibold text-sm">{type.label}</div>
                    <div className="text-muted-dark text-xs">{type.sublabel}</div>
                    <div className="text-gold font-heading font-bold mt-2">
                      ${type.value === 'half' ? guide.priceHalfDay : type.value === 'full' ? guide.priceFullDay : guide.priceCustom * 4}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Guests */}
            <ScrollReveal delay={240}>
              <label className="block">
                <span className="text-cream font-semibold mb-3 flex items-center gap-2">
                  <Users size={18} className="text-gold" />
                  Number of Guests
                </span>
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-12 h-12 rounded-btn border border-dark-500 text-cream text-xl hover:border-gold transition-colors">−</button>
                  <span className="text-2xl font-heading font-bold text-cream w-12 text-center">{guests}</span>
                  <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-12 h-12 rounded-btn border border-dark-500 text-cream text-xl hover:border-gold transition-colors">+</button>
                </div>
              </label>
            </ScrollReveal>

            {/* Visit Purpose */}
            <ScrollReveal delay={280}>
              <div className="space-y-6">
                <div>
                  <span className="text-cream font-semibold mb-3 flex items-center gap-2">
                    <Info size={18} className="text-gold" />
                    Why are you visiting?
                  </span>
                  <select 
                    value={visitPurpose} 
                    onChange={e => setVisitPurpose(e.target.value)} 
                    className="input-dark mt-2" 
                    id="visit-purpose"
                  >
                    <option value="">Select your primary purpose</option>
                    {VISIT_PURPOSES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-cream font-semibold mb-3 flex items-center gap-2">
                    <Star size={18} className="text-gold" />
                    Add a local experience? (Optional)
                  </span>
                  <select 
                    value={localExperience} 
                    onChange={e => setLocalExperience(e.target.value)} 
                    className="input-dark mt-2" 
                    id="local-experience"
                  >
                    <option value="">No local experience needed</option>
                    {LOCAL_EXPERIENCES.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <p className="text-muted-dark text-[11px] mt-1 italic">
                    Guides can better prepare your itinerary if they know your interests.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Details */}
            <ScrollReveal delay={320}>
              <h2 className="text-cream font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gold" />
                Your Details
              </h2>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="input-dark" id="booking-name" />
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="input-dark" id="booking-email" />
                <textarea placeholder="Special requests or notes for your guide..." rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} className="input-dark resize-none" id="booking-requests" />
              </div>
            </ScrollReveal>
          </div>

          {/* Price Summary Sidebar */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="sticky top-28">
              <ScrollReveal>
                <div className="card-dark p-6 border-gold-200">
                  <h3 className="font-heading text-xl font-bold text-cream mb-6">Price Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Guide</span>
                      <span className="text-cream">{guide.name}</span>
                    </div>
                    {date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Date</span>
                        <span className="text-cream">
                          {(() => {
                            const [year, month, day] = date.split('-').map(Number);
                            const localDateObj = new Date(year, month - 1, day);
                            return localDateObj.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                          })()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Tour type</span>
                      <span className="text-cream capitalize">{tourType} day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Base price</span>
                      <span className="text-cream">${basePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Guests</span>
                      <span className="text-cream">× {guests}</span>
                    </div>
                    <div className="h-px bg-dark-600" />
                    <div className="flex justify-between">
                      <span className="text-cream font-semibold">Total</span>
                      <span className="text-gold font-heading text-2xl font-bold">${totalPrice}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-btn px-4 py-3 mb-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleConfirm}
                    disabled={!date || !name || !email || !visitPurpose || processing}
                    className="btn-gold w-full !py-4 text-lg flex items-center justify-center gap-2"
                    id="confirm-booking-btn"
                  >
                    {processing ? (
                      <div className="w-6 h-6 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Confirm & Pay
                      </>
                    )}
                  </button>

                  <p className="text-muted-dark text-xs text-center mt-4">
                    Full refund if cancelled more than 24 hours before the tour
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
