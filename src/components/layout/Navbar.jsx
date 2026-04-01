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
    { to: '/visitor-pricing', label: 'Visitors' },
    { to: '/pricing', label: 'Local Guides' },
    { to: '/guide-register', label: 'Join as Local Guide' },
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
            <Link to="/" className="flex items-center group py-2">
              <img src={logo} alt="YMY Consultancy Logo" className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-item text-sm font-medium ${
                    isActive(link.to) ? 'nav-item-active' : 'text-cream/80'
                  } ${link.label === 'Become a Guide' ? 'border border-gold/20 hover:border-gold/50' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors duration-300 hover:text-gold ${
                    isActive('/admin') ? 'text-gold' : 'text-cream/80 font-bold'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="text-sm text-cream/80 hover:text-gold transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-muted hover:text-cream transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="nav-item text-sm text-cream/80">
                  Sign In
                </Link>
              )}
              <Link to="/search" className="btn-gold text-sm !px-5 !py-2.5">
                {isGuideUser ? 'View Marketplace' : 'Find a Local Guide'}
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
                <Link to="/login" className="flex items-center px-4 py-3 rounded-xl text-cream hover:bg-white/5 transition-colors">Sign In</Link>
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
