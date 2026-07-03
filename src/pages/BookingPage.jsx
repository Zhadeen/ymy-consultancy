import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getGuideById } from '../infrastructure/firebase/repositories/guidesRepository';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import BookingConfirmedScreen from './booking/BookingConfirmedScreen';
import BookingForm from './booking/BookingForm';
import PriceSummarySidebar from './booking/PriceSummarySidebar';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { booking, updateBooking, createPendingBooking, confirmed } = useBooking();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const guideData = await getGuideById(id);
        if (guideData) {
          setGuide(guideData);
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
        guideUid: guide.uid,
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

      await createPendingBooking(bookingData);

      // Navigate to Visitor Dashboard and show success alert
      alert("Booking request sent successfully! The Local Guide will review your request.");
      navigate('/dashboard');
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
    return <BookingConfirmedScreen confirmed={confirmed} totalPrice={totalPrice} />;
  }

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/guide/${guide.id}`} className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors mb-8">
          <ChevronLeft size={16} />
          <span className="text-sm">Back to {guide.name}'s Profile</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          <BookingForm
            guide={guide}
            availableDates={availableDates}
            date={date} setDate={setDate}
            tourType={tourType} setTourType={setTourType}
            guests={guests} setGuests={setGuests}
            visitPurpose={visitPurpose} setVisitPurpose={setVisitPurpose}
            localExperience={localExperience} setLocalExperience={setLocalExperience}
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            specialRequests={specialRequests} setSpecialRequests={setSpecialRequests}
          />

          <PriceSummarySidebar
            guide={guide}
            date={date}
            tourType={tourType}
            basePrice={basePrice}
            guests={guests}
            totalPrice={totalPrice}
            error={error}
            processing={processing}
            canConfirm={!!date && !!name && !!email && !!visitPurpose}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </main>
  );
}
