import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import ScrollReveal from '../components/common/ScrollReveal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { savePaidBooking, confirmed, resetBooking } = useBooking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [guideContact, setGuideContact] = useState({ email: 'Loading...', phone: 'Loading...' });
  const savingRef = useRef(false);

  useEffect(() => {
    const confirmAndSave = async () => {
      if (!sessionId || savingRef.current) return;
      savingRef.current = true;

      try {
        const response = await fetch(`/api/get-session?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          await savePaidBooking(data.metadata);
          setLoading(false);
        } else {
          throw new Error(data.message || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Success Page Error:', err);
        setError(err.message || 'Something went wrong while verifying your payment.');
        setLoading(false);
      }
    };

    confirmAndSave();
  }, [sessionId, savePaidBooking]);

  const handleCopyRef = () => {
    if (confirmed?.reference) {
      navigator.clipboard.writeText(confirmed.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (confirmed?.guideId) {
      const fetchContact = async () => {
        try {
          const guideDoc = await getDoc(doc(db, 'guides', confirmed.guideId));
          if (guideDoc.exists()) {
            setGuideContact({
              email: guideDoc.data().email || 'Contact unavailable',
              phone: guideDoc.data().phone || 'Contact unavailable'
            });
          }
        } catch (err) {
          console.error("Failed to load guide contact:", err);
          setGuideContact({ email: 'Error loading contact', phone: 'Error loading contact' });
        }
      };
      fetchContact();
    }
  }, [confirmed]);

  if (loading) {
    return (
      <main className="pt-20 min-h-screen bg-dark-800 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gold/20 border-t-gold animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="text-gold animate-pulse" size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold text-cream">Verifying Payment</h1>
            <p className="text-muted">Finalizing your booking details, please wait...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center p-4">
        <div className="card-dark p-8 max-w-md w-full text-center border-red-500/30">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-red-500">!</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-cream mb-2">Payment Verification Failed</h1>
          <p className="text-muted mb-8">{error}</p>
          <Link to="/search" className="btn-gold w-full">Back to Search</Link>
        </div>
      </main>
    );
  }

  if (!confirmed) return null;

  return (
    <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center px-4 py-12">
      <ScrollReveal className="max-w-2xl w-full">
        <div className="card-dark p-8 sm:p-12 text-center border-gold-200 relative overflow-hidden">
          {/* Success Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
          
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>

          <h1 className="font-heading text-4xl font-bold text-cream mb-3">Booking Confirmed!</h1>
          <p className="text-muted text-lg mb-10 max-w-md mx-auto">
            Your adventure is officially scheduled. We've sent a detailed receipt to your email.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-10 text-left">
            <div className="bg-dark-600/50 rounded-2xl p-6 space-y-4 border border-dark-500">
              <h3 className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">Experience Details</h3>
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm font-medium">Reference</span>
                <button onClick={handleCopyRef} className="flex items-center gap-1.5 text-gold font-mono font-bold text-sm bg-gold/5 px-2 py-1 rounded hover:bg-gold/10 transition-colors">
                  {confirmed.reference}
                  <Copy size={14} />
                  {copied && <span className="absolute -top-8 right-0 text-xs text-green-400 bg-dark-700 px-2 py-1 rounded border border-green-500/20">Copied!</span>}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Guide</span>
                <span className="text-cream text-sm font-semibold">{confirmed.guideName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Date</span>
                <span className="text-cream text-sm font-semibold">{new Date(confirmed.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted text-sm">Guests</span>
                <span className="text-cream text-sm font-semibold">{confirmed.guests} People</span>
              </div>
              <div className="pt-4 border-t border-dark-500 flex justify-between items-center">
                <span className="text-cream font-bold">Total Paid</span>
                <span className="text-gold font-heading text-2xl font-bold">${confirmed.totalPrice}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gold/5 rounded-2xl p-6 border border-gold/10">
                <h3 className="text-gold text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ArrowRight size={14} /> Next Steps
                </h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex gap-3">
                    <span className="text-gold">1.</span>
                    Check your email for the confirmation voucher.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold">2.</span>
                    Message your guide to coordinate the meeting point.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold">3.</span>
                    Prepare for an unforgettable experience!
                  </li>
                </ul>
              </div>

              <div className="bg-dark-600/50 rounded-2xl p-5 border border-dark-500">
                <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">📍 Local Guide Contact</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-cream text-sm">
                    <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center text-gold min-w-8">
                      <Mail size={14} />
                    </div>
                    <span className="truncate">{guideContact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-cream text-sm">
                    <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center text-gold min-w-8">
                      <Phone size={14} />
                    </div>
                    <span className="truncate">{guideContact.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/chat/${confirmed.guideId}`} className="btn-ghost flex-1 py-4">Message Local Guide</Link>
            <Link to="/" onClick={resetBooking} className="btn-gold flex-1 py-4">Return Home</Link>
          </div>
          
          <p className="mt-8 text-muted-dark text-xs flex items-center justify-center gap-2">
            Securely processed by Stripe <span className="w-1 h-1 rounded-full bg-muted-dark" /> Booking ID: {sessionId.slice(-8)}
          </p>
        </div>
      </ScrollReveal>
    </main>
  );
}
