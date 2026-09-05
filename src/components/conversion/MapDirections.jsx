import { MapPin } from 'lucide-react';
import { SITE } from '../../config/site';

// Map + directions, gated behind a real address in SITE.address. Renders
// NOTHING until an address exists — a service-area business has no storefront to
// map, and we never show a fake pin/location. When the owner supplies an
// address, this embeds a Google Maps view + a directions link.
export default function MapDirections() {
  if (!SITE.address) return null;

  const parts = [
    SITE.address.streetAddress,
    SITE.address.addressLocality,
    SITE.address.addressRegion,
    SITE.address.postalCode,
    SITE.address.addressCountry,
  ].filter(Boolean);
  const query = encodeURIComponent(parts.join(', '));

  return (
    <section aria-labelledby="location-heading" className="py-4">
      <h2 id="location-heading" className="font-heading text-2xl font-bold text-cream mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-gold" aria-hidden="true" /> Find us
      </h2>
      <p className="text-muted mb-4">{parts.join(', ')}</p>
      <div className="rounded-2xl overflow-hidden border border-dark-600">
        <iframe
          title={`Map showing the location of ${SITE.name}`}
          width="100%"
          height="320"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
        />
      </div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost inline-flex items-center gap-2 mt-4"
      >
        Get directions
      </a>
    </section>
  );
}
