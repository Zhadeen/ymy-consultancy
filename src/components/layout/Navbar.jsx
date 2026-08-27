import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isGuideUser = user?.role === 'guide';

  const navLinks = isGuideUser ? [
    { to: '/search', label: 'Explore' },
    { to: '/pricing', label: 'Local Guides' },
  ] : [
    { to: '/search', label: 'Explore' },
    { to: '/visitor-pricing', label: 'Travelers' },
    { to: '/pricing', label: 'Local Guides' },
    { to: '/guide-register', label: 'Join as Local Guide' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-dark-900/75 backdrop-blur-2xl border-b border-gold/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent pt-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-20' : 'h-24'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center group py-2">
              <img src={logo} alt="YMY Consultancy Logo" className={`w-auto object-contain transition-all duration-500 ${scrolled ? 'h-12' : 'h-16'} group-hover:scale-105 group-hover:brightness-110 drop-shadow-md`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-2 py-1 text-sm tracking-wide font-bold transition-all duration-300 group active:scale-95 ${
                    isActive(link.to) ? 'text-gold' : 'text-cream/90 hover:text-gold'
                  }`}
                >
                  {link.label}
                  <span className={`absolute left-0 -bottom-1 h-[2px] bg-gold transition-all duration-300 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`text-sm font-bold tracking-wide transition-colors duration-300 hover:text-gold ${
                    isActive('/admin') ? 'text-gold' : 'text-cream/90'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className="text-sm font-medium text-cream/90 hover:text-gold transition-all duration-300 active:scale-95 px-4 py-2 rounded-full hover:bg-gold/5">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-muted hover:text-rose-400 transition-all duration-300 active:scale-95 px-4 py-2 rounded-full hover:bg-rose-500/10">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/sign-in" className="text-sm font-bold tracking-wide text-cream/90 hover:text-gold transition-all duration-300 px-4 py-2 hover:bg-gold/10 rounded-full active:scale-95">
                  Sign In
                </Link>
              )}
              <Link 
                to="/search" 
                className="btn-gold text-sm font-bold tracking-wide !px-7 !py-3 shadow-[0_0_20px_rgba(201,168,76,0.15)] border border-gold-light/30 relative overflow-hidden group active:scale-95 transition-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[slideInRight_1s_ease-in-out_infinite]" />
                <span className="relative z-10">{isGuideUser ? 'View Marketplace' : 'Find a Local Guide'}</span>
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
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive(link.to) ? 'bg-gold/10 text-gold font-bold' : 'text-cream hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-dark-600 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="text-lg text-cream">Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-lg text-gold font-bold">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="text-lg text-muted text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="flex items-center px-4 py-3 rounded-xl text-cream hover:bg-white/5 transition-colors">Sign In</Link>
                <Link to="/register" className="flex items-center px-4 py-3 rounded-xl text-cream hover:bg-white/5 transition-colors">Register</Link>
              </>
            )}
            <Link to="/search" className="btn-gold text-center mt-4">
              Find a Local Guide
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
