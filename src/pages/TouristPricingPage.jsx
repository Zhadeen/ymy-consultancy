import { useState } from 'react';
import { CreditCard, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/common/ScrollReveal';

export default function TouristPricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login?redirect=/tourist-pricing');
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
      alert('Error initializing subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-dark-900 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-16 flex-1 flex flex-col justify-center">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream mb-4">
              Unlock Your <span className="text-gold">Tourist Pass</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Join YMY Consultancy and get unlimited access to verified local guides worldwide.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ScrollReveal delay={100}>
            <div className="space-y-6">
              <h2 className="font-heading text-2xl font-bold text-cream">Why go Premium?</h2>
              <ul className="space-y-4">
                {[
                  { title: 'Unlimited Bookings', desc: 'No limits on how many guides you can request.' },
                  { title: 'Direct Messaging', desc: 'Chat instantly with guides to plan your custom trip.' },
                  { title: 'Verified Experts', desc: 'Work with the best local guides vetted by our team.' },
                  { title: 'Zero Commission', desc: 'You follow our model: pay the guide directly, no hidden fees.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle2 size={14} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="text-cream font-semibold text-sm">{item.title}</h4>
                      <p className="text-muted-dark text-xs">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="card-dark p-8 border-gold/30 shadow-2xl shadow-gold/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} className="text-gold" />
              </div>
              
              <div className="text-center mb-8">
                <span className="text-muted text-xs uppercase tracking-widest font-bold block mb-2">Unlimited Access</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gold">$5</span>
                  <span className="text-muted font-medium">/month</span>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-lg font-bold group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={20} />
                    Get Tourist Pass
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="mt-6 text-center text-[10px] text-muted-dark uppercase tracking-widest font-medium">
                🔒 Secure One-Step Checkout • Cancel Anytime
              </p>
            </div>
          </ScrollReveal>
        </div>
        
        <div className="mt-16 text-center">
            <Link to="/search" className="text-muted hover:text-gold transition-colors text-sm underline underline-offset-4">
                Continue browsing free
            </Link>
        </div>
      </div>
    </main>
  );
}
