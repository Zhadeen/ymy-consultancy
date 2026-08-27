import { Link } from 'react-router-dom';
import { Compass, Award, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import worldMap from '../assets/world-map.jpg';
import ScrollReveal from '../components/common/ScrollReveal';

// Entry hub reached from "Sign In". Both roles authenticate through the same
// /login form (the app routes each account to its own dashboard by role), so
// these cards are about orientation, not a different login. The value each adds
// is the sign-up path for someone who does not have an account yet: visitors to
// Create Account, guides to the Join as Local Guide application.
export default function SignInChoicePage() {
  return (
    <main className="relative pt-24 min-h-screen bg-dark-900 flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* World-map backdrop: faint, behind everything, so it reads as ambient
          texture rather than competing with the content. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-center bg-cover pointer-events-none"
        style={{ backgroundImage: `url(${worldMap})`, opacity: 0.22 }}
      />
      {/* Dark wash to deepen the edges and keep text crisp over the map. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-dark-900/70 via-dark-900/45 to-dark-900/85"
      />

      <ScrollReveal className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src={logo} alt="YMY Consultancy Logo" className="h-14 w-auto object-contain drop-shadow-lg" />
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Welcome back</h1>
          <p className="text-cream/80 text-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">How would you like to continue?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Visitor */}
          <div className="card-dark !bg-dark-900/85 p-8 flex flex-col items-center text-center border-gold/10 hover:border-gold/40 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-5">
              <Compass size={30} className="text-gold" />
            </div>
            <h2 className="font-heading text-xl font-bold text-cream mb-2">I'm a Visitor</h2>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Book verified local guides and explore cities like a local.
            </p>
            <Link to="/login" className="btn-gold w-full !py-3 flex items-center justify-center gap-2">
              Sign in as Visitor <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="text-muted hover:text-gold text-xs mt-4 transition-colors">
              New here? Create a free account
            </Link>
          </div>

          {/* Local Guide */}
          <div className="card-dark !bg-dark-900/85 p-8 flex flex-col items-center text-center border-gold/10 hover:border-gold/40 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-5">
              <Award size={30} className="text-gold" />
            </div>
            <h2 className="font-heading text-xl font-bold text-cream mb-2">I'm a Local Guide</h2>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Manage your profile, availability, and bookings.
            </p>
            <Link to="/login" className="btn-gold w-full !py-3 flex items-center justify-center gap-2">
              Sign in as Guide <ArrowRight size={16} />
            </Link>
            <Link to="/guide-register" className="text-muted hover:text-gold text-xs mt-4 transition-colors">
              Not a guide yet? Apply to become one
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
