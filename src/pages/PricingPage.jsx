import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X, Star, Crown, Zap, CreditCard, Percent, ShieldCheck, Target, TrendingUp } from 'lucide-react';
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
      const response = await fetch('/api/create-subscription-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          guideId: user.uid,
          guideEmail: user.email,
          planId: plan.id,
          planName: plan.name
        })
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.message || 'Failed to initialize Stripe checkout.');
      }
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
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream mb-6">
              Launch Your Local Guide Business <br className="hidden sm:block" /> with <span className="text-gold underline decoration-gold/30">Zero Upfront Costs</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Start for free. Grow your profile. Earn 85% on every booking you complete. <br />
              <strong>All new Local Guides get their first 90 days completely free.</strong>
            </p>
          </div>
        </ScrollReveal>

        {/* 85/15 Split Section */}
        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="card-dark p-8 flex items-start gap-5 border-gold bg-gold/5">
              <div className="w-14 h-14 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                <Percent size={28} className="text-gold" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-cream mb-2">Our Marketplace Model</h3>
                <p className="text-muted text-sm leading-relaxed">
                  We only succeed when you succeed. We take a small **15% platform commission** on each booking to handle payments, marketing, and 24/7 support. You keep **85%** of your earnings.
                </p>
              </div>
            </div>
            
            <div className="card-dark p-8 flex items-start gap-5 border-blue-500/20 bg-blue-500/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={28} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-cream mb-2">90-Day Free Trial</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Join for free with no listing fees for the first **3 months**. This gives you plenty of time to build your reviews and establish your presence before the monthly subscription begins.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex justify-center mb-24">
          <div className="max-w-md w-full">
            {SUBSCRIPTION_PLANS.map((plan, i) => (
              <ScrollReveal key={plan.id} delay={i * 100}>
                <div className="card-dark p-10 relative border-gold ring-4 ring-gold/10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-dark-900 px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-gold-glow">
                    <Star size={16} /> Most Popular Selection
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="font-heading text-3xl font-bold text-cream mb-3">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-5xl font-bold text-gold">${plan.price}</span>
                      <span className="text-muted text-lg">/{plan.interval}</span>
                    </div>
                    <p className="text-muted-dark text-xs mt-3 bg-dark-600 inline-block px-3 py-1 rounded-full border border-dark-500">
                      Billing starts after your 90-day free trial.
                    </p>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-4 text-sm sm:text-base">
                        <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-cream/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id || currentPlan === plan.id}
                    className="btn-gold w-full !py-4 text-lg font-bold shadow-gold-glow"
                  >
                    {currentPlan === plan.id ? (
                      'Current Active Plan'
                    ) : loading === plan.id ? (
                      'Processing...'
                    ) : (
                      `Start Free Listing Period`
                    )}
                  </button>
                  
                  <p className="text-center text-[11px] text-muted-dark mt-4">
                    Zero risk. Cancel anytime during your 90-day trial.
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Why Choice YMY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: <TrendingUp className="text-gold" />, title: "SEO Optimized", desc: "Your profile is automatically optimized for search engines to bring you more bookings." },
            { icon: <Target className="text-gold" />, title: "Targeted Marketing", desc: "We spend on ads to bring visitors looking for your specific area of expertise." },
            { icon: <Zap className="text-gold" />, title: "Fast Payouts", desc: "Receive your earnings daily to your connected bank account via Stripe Connect." }
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4 border border-gold/20">
                  {item.icon}
                </div>
                <h4 className="text-cream font-bold mb-2">{item.title}</h4>
                <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
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
