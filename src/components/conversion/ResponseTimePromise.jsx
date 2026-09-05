import { Clock } from 'lucide-react';
import { SITE } from '../../config/site';

// Renders a response-time promise ONLY when the owner has set a real value in
// SITE.responseTime. Until then it renders nothing — we never invent a number.
export default function ResponseTimePromise({ className = '' }) {
  if (!SITE.responseTime) return null;
  return (
    <div className={`inline-flex items-center gap-2 text-sm text-muted ${className}`}>
      <Clock size={16} className="text-gold" aria-hidden="true" />
      <span>We typically respond <strong className="text-cream">{SITE.responseTime}</strong>.</span>
    </div>
  );
}
