import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react'; // if needed later
import { Mail, MapPin, Phone, ExternalLink, Hash, Heart, Play } from 'lucide-react';
import logo from '../../assets/logo.png';
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
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="YMY Consultancy Logo" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Premium tour guide experiences worldwide. Connecting curious travelers with verified local experts since 2024.
            </p>
            <div className="flex gap-3">
              {[
                { 
                  name: 'X', 
                  href: '#', 
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> 
                },
                { 
                  name: 'Facebook', 
                  href: '#', 
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> 
                },
                { 
                  name: 'Instagram', 
                  href: '#', 
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
                },
                { 
                  name: 'TikTok', 
                  href: '#', 
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.97-3.993h-3.4V16.71a3.25 3.25 0 0 1-3.25 3.25 3.25 3.25 0 0 1-3.25-3.25 3.25 3.25 0 0 1 3.25-3.25c.38 0 .74.07 1.08.19V10.1a6.76 6.76 0 0 0-1.08-.09 6.75 6.75 0 0 0-6.75 6.75 6.75 6.75 0 0 0 6.75 6.75 6.75 6.75 0 0 0 6.75-6.75V10.51a8.4 8.4 0 0 0 4.09 1.13V8.16a5.1 5.1 0 0 1-4.22-1.474z"/></svg> 
                }
              ].map(social => (
                <a key={social.name} href={social.href} aria-label={social.name} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-muted hover:text-gold hover:bg-dark-600 transition-all duration-300">
                  {social.icon}
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
              {[
                { label: 'Help Center', to: '/help' },
                { label: 'Safety', to: '/safety' },
                { label: 'Cancellation Policy', to: '/cancellation' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(item => (
                <Link key={item.label} to={item.to} className="text-muted text-sm hover:text-gold transition-colors duration-300">
                  {item.label}
                </Link>
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
