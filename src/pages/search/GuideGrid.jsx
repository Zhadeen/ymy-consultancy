import { Link } from 'react-router-dom';
import { MapPin, Languages, BadgeCheck } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function GuideGrid({ loading, guides, onClearFilters }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-heading text-2xl text-cream mb-2">No Local Guides found</h3>
        <p className="text-muted mb-6">Try adjusting your filters to see more results.</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
           <button onClick={onClearFilters} className="btn-gold">Clear All Filters</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {guides.map((guide, i) => (
        <ScrollReveal key={guide.id} delay={i * 60}>
          <Link to={`/guide/${guide.id}`} className="block group h-full">
            <div className="card-dark overflow-hidden h-full flex flex-col">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-transparent to-transparent" />
                {guide.idVerified && (
                  <div className="absolute top-3 right-3 bg-dark-800/80 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 border border-gold/30">
                    <BadgeCheck size={12} className="text-gold" />
                    <span className="text-[10px] text-cream font-medium">ID Verified</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-green-500/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider">
                    Available
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-gold rounded-lg px-2.5 py-1">
                  <span className="text-dark-900 text-sm font-bold">${guide.priceFullDay}</span>
                  <span className="text-dark-900/70 text-[10px]">/day</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading text-lg font-semibold text-cream group-hover:text-gold transition-colors duration-300">
                  {guide.name}
                </h3>
                <div className="flex items-center gap-1.5 text-muted text-sm mt-1">
                  <MapPin size={14} />
                  <span>{guide.country}, {guide.city}</span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={guide.rating} size={13} />
                  <span className="text-muted-dark text-xs">({guide.reviewCount})</span>
                </div>

                <div className="flex items-center gap-1.5 text-muted-dark text-xs mt-3">
                  <Languages size={12} />
                  <span>{(guide.languages || []).join(' · ')}</span>
                </div>

                <div className="mt-auto pt-4">
                  <span className="btn-gold w-full block text-center text-sm !py-2.5">
                    View Profile
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}
