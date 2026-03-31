import { useState } from 'react';
import { X, CreditCard, CheckCircle2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TouristPricingModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-tourist-subscription-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_TOURIST_PRICE_ID,
          userId: user.uid,
          userEmail: user.email
        })
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.message || 'Failed to initialize Stripe checkout.');
      }
    } catch (err) {
      console.error('Tourist Subscription error:', err);
      alert(err.message || 'Error initializing subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-gold/30 rounded-3xl max-w-md w-full overflow-hidden relative shadow-2xl shadow-gold/10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-cream transition-colors rounded-full hover:bg-dark-700"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 rotate-3">
            <Zap size={32} className="text-gold fill-gold/20" />
          </div>

          <h2 className="font-heading text-3xl font-bold text-cream mb-2">Get Your Tourist Pass</h2>
          <p className="text-muted text-sm mb-8">
            Unlock the full YMY experience and start planning your next adventure today.
          </p>

          <div className="bg-dark-800 rounded-2xl p-6 mb-8 text-left border border-dark-600">
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-bold text-gold">$5</span>
              <span className="text-muted">/month</span>
            </div>

            <ul className="space-y-4">
              {[
                'Unlimited booking requests',
                'Real-time chat with guides',
                'Access to verified local experts',
                'Priority customer support'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-cream/90">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-lg font-bold shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.11] transition-all"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard size={20} />
                {user ? 'Subscribe Now' : 'Sign In to Unlock'}
              </>
            )}
          </button>
          
          <p className="mt-4 text-[10px] text-muted-dark uppercase tracking-widest font-medium">
            🔒 Secure Payment via Stripe • Cancel Anytime
          </p>
        </div>
      </div>
    </div>
  );
}
