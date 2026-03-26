import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/search', label: 'Explore' },
    { to: '/#how-it-works', label: 'How It Works' },
    { to: '/guide-register', label: 'Become a Guide' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-900/95 backdrop-blur-xl shadow-lg border-b border-dark-600/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Globe className="w-8 h-8 text-gold transition-transform duration-300 group-hover:rotate-12" />
              <div>
                <span className="text-xl font-heading font-bold text-cream tracking-wide">YMY</span>
                <span className="text-xs text-muted block -mt-1 tracking-[0.2em] uppercase">Consultancy</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-gold ${
                    isActive(link.to) ? 'text-gold' : 'text-cream/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="text-sm text-cream/80 hover:text-gold transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-sm text-muted hover:text-cream transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm text-cream/80 hover:text-gold transition-colors">
                  Sign In
                </Link>
              )}
              <Link to="/search" className="btn-gold text-sm !px-5 !py-2.5">
                Find My Guide
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-cream p-2"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          mobileOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-400 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-72 bg-dark-800 border-l border-dark-600 p-6 pt-24 transition-transform duration-400 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-lg font-medium transition-colors ${
                  isActive(link.to) ? 'text-gold' : 'text-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-dark-600 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="text-lg text-cream">Dashboard</Link>
                <button onClick={logout} className="text-lg text-muted text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-lg text-cream">Sign In</Link>
                <Link to="/register" className="text-lg text-cream">Register</Link>
              </>
            )}
            <Link to="/search" className="btn-gold text-center mt-4">
              Find My Guide
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
