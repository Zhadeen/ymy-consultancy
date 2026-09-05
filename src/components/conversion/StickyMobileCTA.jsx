import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';

const KEY = 'ymy_sticky_cta_dismissed';

// Mobile-only (<768px) sticky contact bar. Dismissible (remembered per browser),
// keyboard-reachable (real <Link> + <button>). Hidden on md+ where the desktop
// header CTAs are visible. Guards localStorage so it's prerender-safe.
export default function StickyMobileCTA() {
  const [dismissed, setDismissed] = useState(() => {
    try { return typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1'; }
    catch { return false; }
  });

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(KEY, '1'); } catch { /* private mode: fine */ }
  };

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-[80] border-t border-gold/30 bg-dark-800/95 backdrop-blur px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex items-center gap-2 shadow-2xl"
      role="region"
      aria-label="Contact YMY"
    >
      <Link
        to="/contact"
        className="btn-gold flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold"
      >
        <MessageSquare size={16} aria-hidden="true" /> Contact a guide
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss contact bar"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-btn text-muted hover:text-cream focus-visible:ring-2 focus-visible:ring-gold"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
