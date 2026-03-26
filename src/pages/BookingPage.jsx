import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, Clock, ChevronLeft, CreditCard, CheckCircle2, MapPin, Copy, Mail, Phone } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useBooking } from '../context/BookingContext';
import ScrollReveal from '../components/common/ScrollReveal';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, updateBooking, confirmBooking, confirmed } = useBooking();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const [date, setDate] = useState('');
  const [tourType, setTourType] = useState('full');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const priceMap = { half: guide.priceHalfDay, full: guide.priceFullDay, custom: guide.priceCustom * 4 };
  const basePrice = priceMap[tourType] || guide.priceFullDay;
  const totalPrice = basePrice * guests;

  const tourTypes = [
    { value: 'half', label: 'Half Day', sublabel: '4 hours', icon: '🌤️' },
    { value: 'full', label: 'Full Day', sublabel: '8 hours', icon: '☀️' },
    { value: 'custom', label: 'Custom', sublabel: 'Flexible', icon: '✨' },
  ];

  const availableDates = useMemo(() => {
    if (!guide || !guide.availability) return [];
    return Object.entries(guide.availability)
      .filter(([, avail]) => avail)
      .map(([dateStr]) => dateStr)
      .sort();
  }, [guide]);

  const handleConfirm = async () => {
    if (!date || !name || !email) return;
    setProcessing(true);
    await confirmBooking({ touristName: name, touristEmail: email, specialRequests, date, tourType, guests, totalPrice, guideName: guide.name, guideId: guide.id });
    setProcessing(false);
  };

  const handleCopyRef = () => {
    if (confirmed?.reference) {
      navigator.clipboard.writeText(confirmed.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Confirmation screen
  if (confirmed) {
    return (
      <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center px-4">
        <ScrollReveal className="max-w-lg w-full">
          <div className="card-dark p-8 sm:p-10 text-center border-gold-200">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>

            <h1 className="font-heading text-3xl font-bold text-cream mb-2">Booking Confirmed!</h1>
            <p className="text-muted mb-8">Your adventure awaits. We've sent the details to your email.</p>

            <div className="bg-dark-600 rounded-2xl p-6 mb-6 text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-muted text-sm">Reference</span>
                <button onClick={handleCopyRef} className="flex items-center gap-1.5 text-gold font-mono font-semibold text-sm hover:text-gold-light transition-colors">
                  {confirmed.reference}
                  <Copy size={14} />
                  {copied && <span className="text-xs text-green-400">Copied!</span>}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Guide</span>
                <span className="text-cream text-sm font-medium">{confirmed.guideName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Date</span>
                <span className="text-cream text-sm font-medium">{new Date(confirmed.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Type</span>
                <span className="text-cream text-sm font-medium capitalize">{confirmed.tourType} Day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Guests</span>
                <span className="text-cream text-sm font-medium">{confirmed.guests}</span>
              </div>
              <div className="h-px bg-dark-500" />
              <div className="flex justify-between">
                <span className="text-cream font-semibold">Total Paid</span>
                <span className="text-gold font-heading text-xl font-bold">${confirmed.totalPrice}</span>
              </div>
            </div>

            <div className="bg-gold-100 rounded-2xl p-4 mb-6 text-left">
              <p className="text-gold text-sm font-medium mb-2">📍 Guide Contact Info</p>
              <div className="flex items-center gap-2 text-cream text-sm">
                <Mail size={14} className="text-gold" />
                <span>guide@ymyconsultancy.com</span>
              </div>
              <div className="flex items-center gap-2 text-cream text-sm mt-2">
                <Phone size={14} className="text-gold" />
                <span>+33 6 12 34 56 78</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to={`/chat/${confirmed.guideId}`} className="btn-ghost flex-1">Message Guide</Link>
              <Link to="/" className="btn-gold flex-1">Back to Home</Link>
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
                Book Your Tour
              </h1>
              <div className="flex items-center gap-3 text-muted">
                <img src={guide.photo} alt={guide.name} className="w-10 h-10 rounded-full object-cover border border-dark-500" />
                <div>
                  <span className="text-cream font-medium">{guide.name}</span>
                  <span className="flex items-center gap-1 text-xs"><MapPin size={12} />{guide.city}</span>
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
                <select value={date} onChange={e => setDate(e.target.value)} className="input-dark mt-2" id="booking-date">
                  <option value="">Choose an available date</option>
                  {availableDates.map(d => (
                    <option key={d} value={d}>
                      {new Date(d).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </option>
                  ))}
                </select>
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
                        <span className="text-cream">{new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
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

                  <button
                    onClick={handleConfirm}
                    disabled={!date || !name || !email || processing}
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
                    Free cancellation up to 48 hours before your tour
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
