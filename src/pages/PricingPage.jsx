import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Star, Crown, Zap, CreditCard } from 'lucide-react';
import { SUBSCRIPTION_PLANS, GUIDE_ADDONS } from '../config/stripe';
import ScrollReveal from '../components/common/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  useState(() => {
    const checkCurrentPlan = async () => {
      if (user) {
        const subDoc = await getDoc(doc(db, 'subscriptions', user.uid));
        if (subDoc.exists()) {
          setCurrentPlan(subDoc.data().planId);
        }
      }
    };
    checkCurrentPlan();
  }, [user]);

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    if (plan.id === 'free') {
      navigate('/guide-register');
      return;
    }

    setLoading(plan.id);
    
    try {
      await setDoc(doc(db, 'subscriptions', user.uid), {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        status: 'active',
        startDate: new Date().toISOString(),
        addons: [],
        paymentStatus: 'pending',
      }, { merge: true });

      alert(`Selected ${plan.name} - $${plan.price}/month!\n\nPayment integration ready. In production, this would redirect to Stripe checkout.`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Error subscribing. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream mb-4">
              Choose Your Plan
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Start free and upgrade when you're ready. Grow your tourism business with YMY.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 100}>
              <div className={`card-dark p-8 relative ${
                plan.popular ? 'border-gold ring-2 ring-gold/30' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-dark-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star size={14} /> Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-heading text-2xl font-bold text-cream mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gold">${plan.price}</span>
                    <span className="text-muted">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-cream">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm opacity-50">
                      <X size={18} className="text-muted flex-shrink-0 mt-0.5" />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    currentPlan === plan.id
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                      : plan.popular
                        ? 'btn-gold'
                        : 'border border-gold text-gold hover:bg-gold hover:text-dark-900'
                  }`}
                >
                  {currentPlan === plan.id ? (
                    'Current Plan'
                  ) : loading === plan.id ? (
                    'Processing...'
                  ) : plan.id === 'free' ? (
                    'Get Started Free'
                  ) : (
                    `Subscribe - $${plan.price}/mo`
                  )}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-cream mb-4">
              Add-on Services
            </h2>
            <p className="text-muted">Enhance your profile with optional extras</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {GUIDE_ADDONS.map((addon, i) => (
            <ScrollReveal key={addon.id} delay={i * 100}>
              <div className="card-dark p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-lg font-semibold text-cream">{addon.name}</h3>
                  <span className="text-gold font-bold">${addon.price}{addon.perBooking ? '/booking' : '/mo'}</span>
                </div>
                <p className="text-muted text-sm mb-4">{addon.description}</p>
                <button className="btn-ghost w-full text-sm">
                  Add to Plan
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="card-dark p-8 text-center max-w-3xl mx-auto">
            <CreditCard size={48} className="text-gold mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-cream mb-2">
              Secure Payments
            </h3>
            <p className="text-muted mb-4">
              All payments are processed securely through Stripe. Cancel anytime.
            </p>
            <div className="flex justify-center gap-4 text-muted text-sm">
              <span>🔒 SSL Encrypted</span>
              <span>💳 All Cards Accepted</span>
              <span>↩️ 30-Day Refunds</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
