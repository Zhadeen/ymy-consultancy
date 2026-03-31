import { useState } from 'react';
import { CreditCard, CheckCircle2, Zap, ArrowRight, ShieldCheck, MessageSquare, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/common/ScrollReveal';

export default function VisitorPricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (!user) {
      navigate('/login?redirect=/visitor-pricing');
    } else {
      navigate('/search');
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-dark-900 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 flex-1 flex flex-col justify-center">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-cream mb-6">
              Adventure Awaits, <span className="text-gold">No Subscription Required</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              We've evolved. The YMY Local Guide Platform is now a transparent marketplace. Register for free, find your guide, and pay only for the experiences you book.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {[
            { 
              icon: ShieldCheck, 
              title: 'Verified Expertise', 
              desc: 'Every Local Guide is vetted by our team for safety and local knowledge.' 
            },
            { 
              icon: MessageSquare, 
              title: 'Direct Connection', 
              desc: 'Chat with your guide before booking to customize your perfect experience.' 
            },
            { 
              icon: Star, 
              title: 'Transparent Pricing', 
              desc: 'No hidden fees. A standard 15% platform fee is already included in the displayed price.' 
            }
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="card-dark p-8 h-full flex flex-col items-center text-center group hover:border-gold/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform">
                  <item.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-heading font-bold text-cream mb-3">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="max-w-2xl mx-auto card-dark p-8 md:p-12 border-gold/30 shadow-2xl shadow-gold/5 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap size={120} className="text-gold" />
            </div>
            
            <div className="mb-8">
              <span className="text-muted text-xs uppercase tracking-widest font-bold block mb-4">Marketplace Access</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-bold text-cream">FREE</span>
                <span className="text-muted font-medium">/ forever</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 text-left max-w-sm mx-auto">
              {[
                'Access to 500+ verified Local Guides',
                'Unlimited chat requests',
                '24-hour full refund protection',
                'Fast, secure checkout via Stripe',
                'No monthly or hidden fees'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-cream/80 text-sm">
                  <CheckCircle2 size={16} className="text-gold" />
                  {benefit}
                </div>
              ))}
            </div>

            <button
              onClick={handleAction}
              className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-lg font-bold group"
            >
              {user ? 'Find Your Local Guide' : 'Register for Free'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="mt-6 text-[10px] text-muted-dark uppercase tracking-widest font-medium">
              🔒 Safe & Secure Marketplace • Powered by Stripe
            </p>
          </div>
        </ScrollReveal>
        
        <div className="mt-16 text-center space-y-4">
            <p className="text-muted-dark text-xs italic">
                *Cancellations made more than 24 hours before the experience start time receive a 100% refund.
            </p>
            <Link to="/search" className="text-muted hover:text-gold transition-colors text-sm underline underline-offset-4 block">
                Skip and browse guides
            </Link>
        </div>
      </div>
    </main>
  );
}
