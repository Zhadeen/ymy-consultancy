import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Languages, BadgeCheck } from 'lucide-react';
import { query, collection, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import StarRating from '../common/StarRating';
import ScrollReveal from '../common/ScrollReveal';

export default function FeaturedGuides() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'guides'), limit(8));
        const snap = await getDocs(q);
        setGuides(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching featured guides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="section-padding bg-dark-800">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Handpicked for You</span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-cream">
                Featured Guides
              </h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scroll(-1)}
                className="w-12 h-12 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-12 h-12 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
        >
          {loading ? (
            <div className="w-full py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            </div>
          ) : guides.map((guide, i) => (
            <ScrollReveal key={guide.id} delay={i * 80} className="flex-shrink-0 w-[300px]">
              <Link to={`/guide/${guide.id}`} className="block group">
                <div className="card-dark overflow-hidden">
                  {/* Photo */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-transparent to-transparent" />

                    {/* Verified badge */}
                    {guide.idVerified && (
                      <div className="absolute top-3 right-3 bg-dark-800/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-gold/30">
                        <BadgeCheck size={14} className="text-gold" />
                        <span className="text-xs text-cream font-medium">ID Verified</span>
                      </div>
                    )}

                    {/* Price badge */}
                    <div className="absolute bottom-3 right-3 bg-gold rounded-btn px-3 py-1.5">
                      <span className="text-dark-900 text-sm font-bold">${guide.priceFullDay}</span>
                      <span className="text-dark-900/70 text-xs">/day</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-cream group-hover:text-gold transition-colors duration-300">
                      {guide.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted text-sm mt-1 mb-3">
                      <MapPin size={14} />
                      <span>{guide.country}, {guide.city}</span>
                    </div>

                    <StarRating rating={guide.rating} size={14} />

                    <div className="flex items-center gap-1.5 text-muted-dark text-xs mt-3">
                      <Languages size={12} />
                      <span>{(guide.languages || []).join(' · ')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* View All */}
        <ScrollReveal className="text-center mt-12">
          <Link to="/search" className="btn-ghost inline-flex items-center gap-2">
            View All Guides
            <ChevronRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
