import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Reusable above-the-fold call-to-action (primary + optional secondary).
// Marketplace defaults: find a guide (primary), become a guide (secondary).
export default function CTA({
  primaryLabel = 'Find a Local Guide',
  primaryTo = '/search',
  secondaryLabel = 'Become a Guide',
  secondaryTo = '/guide-register',
  align = 'left',
  className = '',
}) {
  const justify = align === 'center' ? 'justify-center' : 'justify-start';
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${justify} ${className}`}>
      <Link
        to={primaryTo}
        className="btn-gold inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold"
      >
        {primaryLabel} <ArrowRight size={18} />
      </Link>
      {secondaryLabel && secondaryTo && (
        <Link
          to={secondaryTo}
          className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base"
        >
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}
