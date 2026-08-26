import { Link, useLocation } from 'react-router-dom';
import { Home, Search, LifeBuoy, MessageSquare } from 'lucide-react';
import ScrollReveal from '../components/common/ScrollReveal';

export default function NotFoundPage() {
  const { pathname } = useLocation();

  // Show what was actually requested so a typo is self-evident, capped so a very
  // long path cannot blow out the layout. React escapes this on render.
  const attempted = pathname.length > 60 ? `${pathname.slice(0, 60)}…` : pathname;

  return (
    <main className="pt-20 min-h-screen bg-dark-900 flex items-center justify-center px-4 py-20">
      <ScrollReveal className="w-full max-w-lg text-center">
        <p className="font-heading text-7xl sm:text-8xl font-bold text-gold mb-4">404</p>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-3">
          This page doesn't exist
        </h1>

        <p className="text-muted text-sm leading-relaxed mb-6">
          The address may have been mistyped, or the page may have moved.
        </p>

        <div className="inline-block bg-dark-800 border border-dark-600 rounded-btn px-4 py-2 mb-10 max-w-full overflow-hidden">
          <code className="text-muted-dark text-xs break-all">{attempted}</code>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link to="/" className="btn-gold flex items-center justify-center gap-2 !py-3 !px-7">
            <Home size={18} /> Back to home
          </Link>
          <Link to="/search" className="btn-ghost flex items-center justify-center gap-2 !py-3 !px-7">
            <Search size={18} /> Find a Local Guide
          </Link>
        </div>

        <div className="pt-8 border-t border-dark-600/50">
          <p className="text-muted-dark text-xs uppercase tracking-widest mb-4">
            Looking for something else?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link to="/dashboard" className="text-muted hover:text-gold text-sm transition-colors">
              My dashboard
            </Link>
            <Link to="/chat" className="text-muted hover:text-gold text-sm transition-colors flex items-center gap-1.5">
              <MessageSquare size={13} /> Messages
            </Link>
            <Link to="/help" className="text-muted hover:text-gold text-sm transition-colors flex items-center gap-1.5">
              <LifeBuoy size={13} /> Help Center
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
