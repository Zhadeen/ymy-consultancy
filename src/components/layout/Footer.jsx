import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react'; // if needed later
import { Mail, MapPin, Phone, ExternalLink, Hash, Heart, Play, Shield } from 'lucide-react';
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
              Premium local guide experiences worldwide. Connecting curious travelers with verified local experts since 2024.
            </p>
            <div className="flex gap-3">
              {[ 
                { 
                  name: 'Facebook', 
                  href: 'https://www.facebook.com/share/1CXMU4fAHb/?mibextid=wwXIfr', 
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> 
                },
                { 
                  name: 'Instagram', 
                  href: 'https://www.instagram.com/ymycons?igsh=MTl3dzZkanFsbnpiNg%3D%3D&utm_source=qr', 
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
                },
                { 
                  name: 'LinkedIn', 
                  href: 'https://www.linkedin.com/company/ymycons/', 
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> 
                },
                { 
                  name: 'WhatsApp', 
                  href: 'https://wa.me/905435082886', 
                  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg> 
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
                { to: '/search', label: 'Find a Local Guide' },
                { to: '/#how-it-works', label: 'How It Works' },
                { to: '/guide-register', label: 'Become a Local Guide' },
                { to: '/sign-in', label: 'Sign In' },
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
                { label: 'Pricing', to: '/pricing' },
                { label: 'Chat on WhatsApp', href: 'https://wa.me/905435082886' },
                { label: 'Cancellation Policy', to: '/cancellation' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(item => (
                item.to ? (
                  <Link key={item.label} to={item.to} className="text-muted text-sm hover:text-gold transition-colors duration-300">
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="text-muted text-sm hover:text-gold transition-colors duration-300">
                    {item.label}
                  </a>
                )
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
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1 text-muted-dark text-xs">
              <MapPin size={12} />
              <span>Serving 50+ cities worldwide</span>
            </div>
            {/* Discreet staff entry point. Not an access control: /admin is
                guarded by ProtectedRoute and the Firestore rules. */}
            <Link
              to="/ymy-console"
              className="flex items-center gap-1.5 text-muted-dark/50 hover:text-gold text-xs transition-colors duration-300"
            >
              <Shield size={11} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
