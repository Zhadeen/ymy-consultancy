import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone, ExternalLink, Hash, Heart, Play } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-dark-900 border-t border-dark-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Globe className="w-8 h-8 text-gold" />
              <div>
                <span className="text-xl font-heading font-bold text-cream">YMY</span>
                <span className="text-xs text-muted block -mt-1 tracking-[0.2em] uppercase">Consultancy</span>
              </div>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Premium tour guide experiences worldwide. Connecting curious travelers with verified local experts since 2024.
            </p>
            <div className="flex gap-3">
              {[ExternalLink, Hash, Heart, Play].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-muted hover:text-gold hover:bg-dark-600 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-cream font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: '/search', label: 'Find a Guide' },
                { to: '/#how-it-works', label: 'How It Works' },
                { to: '/guide-register', label: 'Become a Guide' },
                { to: '/login', label: 'Sign In' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-muted text-sm hover:text-gold transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-cream font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-3">
              {['Help Center', 'Safety', 'Cancellation Policy', 'Terms of Service', 'Privacy Policy'].map(item => (
                <a key={item} href="#" className="text-muted text-sm hover:text-gold transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-cream font-semibold mb-4">Stay Inspired</h4>
            <p className="text-muted text-sm mb-4">
              Travel tips, new destinations, and exclusive offers. No spam, ever.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark text-sm !py-2.5 flex-1"
              />
              <button type="submit" className="btn-gold text-sm !px-4 !py-2.5 whitespace-nowrap">
                {subscribed ? '✓' : 'Join'}
              </button>
            </form>
            {subscribed && (
              <p className="text-gold text-xs mt-2 animate-fade-in">Welcome aboard! ✨</p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-dark-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-dark text-xs">
            © {new Date().getFullYear()} YMY Consultancy. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-muted-dark text-xs">
            <MapPin size={12} />
            <span>Serving 50+ cities worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
