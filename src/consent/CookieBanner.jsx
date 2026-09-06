import { Link } from 'react-router-dom';
import { useConsent } from './useConsent';
import { setConsent } from './consentStore';

// Cookie consent banner. Shows only while the choice is undecided. Accept and
// Reject are equally prominent (reject-all as easy as accept-all). Until the
// visitor accepts, analytics and the chat widget do not load (see Analytics.jsx
// and useZendesk). Keyboard-reachable; does not trap focus.
export default function CookieBanner() {
  const consent = useConsent();
  if (consent) return null; // decided (accepted or rejected) → hidden

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[95] p-3 sm:p-4"
    >
      <div className="max-w-3xl mx-auto card-dark !bg-dark-800 border border-gold/30 p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-cream/90 text-sm leading-relaxed flex-1">
          We use strictly-necessary cookies to keep you signed in. With your consent we also use
          analytics and our live-chat widget. See our{' '}
          <Link to="/cookies" className="text-gold hover:underline">Cookies Policy</Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setConsent('rejected')}
            className="btn-ghost !py-2.5 px-5 text-sm flex-1 sm:flex-none"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => setConsent('accepted')}
            className="btn-gold !py-2.5 px-5 text-sm flex-1 sm:flex-none"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
