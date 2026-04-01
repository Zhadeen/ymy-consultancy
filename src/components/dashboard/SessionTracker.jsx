import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CheckCircle2, XCircle, MapPin, PlayCircle, Flag, CreditCard, Clock, Loader2, Star } from 'lucide-react';

export default function SessionTracker({ booking, role, onReviewClick }) {
  const [loading, setLoading] = useState(false);

  // Guide actions
  const handleAccept = async () => advanceState('accepted');
  const handleDecline = async () => advanceState('declined');
  const handleArrive = async () => advanceState('arrived');
  const handleStart = async () => advanceState('in_progress');
  const handleEnd = async () => advanceState('completed');

  const advanceState = async (newStatus) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'bookings', booking.id), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update booking status.");
    } finally {
      setLoading(false);
    }
  };

  // Visitor action
  const handlePayNow = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingData: { ...booking, bookingId: booking.id }, 
          userId: booking.visitorId 
        }),
      });
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create checkout session");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gold py-2">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm font-medium">Updating session...</span>
      </div>
    );
  }

  // --- Guide View ---
  if (role === 'guide') {
    switch (booking.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dark-600">
            <button onClick={handleAccept} className="btn-gold flex-1 !py-2 text-sm">Accept Request</button>
            <button onClick={handleDecline} className="btn-ghost flex-1 !py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30">Decline</button>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-600 text-yellow-400">
            <Clock size={16} />
            <span className="text-sm font-medium">Waiting for visitor to complete payment.</span>
          </div>
        );
      case 'on_the_way':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-2 rounded-xl text-sm font-medium">
              <CheckCircle2 size={16} />
              Payment Confirmed
            </div>
            <button onClick={handleArrive} className="btn-gold w-full !py-2 text-sm flex justify-center gap-2">
              <MapPin size={16} /> I Have Arrived
            </button>
          </div>
        );
      case 'arrived':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
            <button onClick={handleStart} className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
              <PlayCircle size={16} /> Start Session
            </button>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
            <div className="flex items-center justify-center gap-2 text-gold animate-pulse mb-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-sm font-bold tracking-widest uppercase">Visit in Progress</span>
            </div>
            <button onClick={handleEnd} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
              <Flag size={16} /> End Session
            </button>
          </div>
        );
      case 'completed':
        if (!booking.guideReviewed) {
          return (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
              <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold uppercase tracking-wider">Session Complete</span>
              </div>
              <button onClick={() => onReviewClick?.(booking)} className="btn-gold w-full !py-2 text-sm flex items-center justify-center gap-2">
                <Star size={16} className="fill-current" /> Rate Your Guest
              </button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-dark-600 text-muted">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-sm">Session Complete & Reviewed</span>
          </div>
        );
      case 'declined':
        return (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-dark-600 text-red-400">
            <XCircle size={16} />
            <span className="text-sm">You declined this request</span>
          </div>
        );
      default:
        return null;
    }
  }

  // --- Visitor View ---
  if (role === 'visitor') {
    switch (booking.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-600 text-yellow-400">
            <Clock size={16} />
            <span className="text-sm font-medium">Awaiting Guide Confirmation</span>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600">
            <div className="text-sm text-green-400 flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} /> Guide Accepted!
            </div>
            <button onClick={handlePayNow} className="btn-gold w-full flex items-center justify-center gap-2 !py-2 text-sm">
              <CreditCard size={16} /> Secure Payment via Stripe
            </button>
          </div>
        );
      case 'on_the_way':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600 bg-dark-600/50 -mx-5 -mb-5 p-5 rounded-b-2xl">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                <MapPin size={20} className="text-gold animate-bounce" />
              </div>
              <span className="text-cream font-bold">Guide is traveling</span>
              <span className="text-xs text-muted">Please wait at your designated meeting point</span>
            </div>
          </div>
        );
      case 'arrived':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600 bg-green-500/10 -mx-5 -mb-5 p-5 rounded-b-2xl border-t-green-500/20">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                <CheckCircle2 size={20} className="text-green-400" />
              </div>
              <span className="text-green-400 font-bold">Your guide is here!</span>
              <span className="text-xs text-green-400/70">Meet up to begin the session</span>
            </div>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600 bg-gold/5 -mx-5 -mb-5 p-5 rounded-b-2xl border-t-gold/20">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <div className="flex items-center gap-2 text-gold animate-pulse mb-1">
                <PlayCircle size={20} />
              </div>
              <span className="text-gold font-bold">Visit in Progress</span>
              <span className="text-xs text-gold/70">Enjoy your local experience!</span>
            </div>
          </div>
        );
      case 'completed':
        if (!booking.visitorReviewed) {
          return (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-dark-600 bg-dark-600 -mx-5 -mb-5 p-5 rounded-b-2xl">
              <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold uppercase tracking-wider">Session Successfully Completed</span>
              </div>
              <button onClick={() => onReviewClick?.(booking)} className="btn-gold w-full !py-2 text-sm flex items-center justify-center gap-2">
                <Star size={16} className="fill-current" /> Rate Your Guide
              </button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-dark-600 text-muted bg-dark-600 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-sm">Session Complete & Reviewed</span>
          </div>
        );
      case 'declined':
        return (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-dark-600 text-red-400">
            <XCircle size={16} />
            <span className="text-sm">Request was declined</span>
          </div>
        );
      default:
        return null;
    }
  }

  return null;
}
