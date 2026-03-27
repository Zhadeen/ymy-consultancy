import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Languages, Filter, X, ChevronDown, SlidersHorizontal, BadgeCheck, Star } from 'lucide-react';
import { CITIES, LANGUAGES } from '../data/mockData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import StarRating from '../components/common/StarRating';
import ScrollReveal from '../components/common/ScrollReveal';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [maxPrice, setMaxPrice] = useState(300);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');

  const [allGuides, setAllGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('city')) setCity(searchParams.get('city'));
    if (searchParams.get('language')) setLanguage(searchParams.get('language'));
  }, [searchParams]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'guides'));
        const guidesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllGuides(guidesData);
      } catch (err) {
        console.error('Error fetching guides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const filteredGuides = useMemo(() => {
    let guides = [...allGuides];
    if (city) guides = guides.filter(g => g.city === city);
    if (language) guides = guides.filter(g => (g.languages || []).includes(language));
    guides = guides.filter(g => (g.priceFullDay || 9999) <= maxPrice);
    guides = guides.filter(g => (g.rating || 0) >= minRating);

    switch (sortBy) {
      case 'price-low': guides.sort((a, b) => (a.priceFullDay || 0) - (b.priceFullDay || 0)); break;
      case 'price-high': guides.sort((a, b) => (b.priceFullDay || 0) - (a.priceFullDay || 0)); break;
      case 'rating': guides.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'bookings': guides.sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0)); break;
    }
    return guides;
  }, [allGuides, city, language, maxPrice, minRating, sortBy]);

  const clearFilters = () => {
    setCity('');
    setLanguage('');
    setMaxPrice(300);
    setMinRating(0);
    setSearchParams({});
  };

  const activeFilterCount = [city, language, maxPrice < 300, minRating > 0].filter(Boolean).length;

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">
            Explore Guides
          </h1>
          <p className="text-muted">
            {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'} available
            {city ? ` in ${city}` : ' worldwide'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-cream">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-gold hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* City */}
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">City</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="input-dark text-sm" id="filter-city">
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="input-dark text-sm" id="filter-language">
                  <option value="">All Languages</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">
                  Max Price: <span className="text-gold">${maxPrice}/day</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={300}
                  step={10}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold"
                  id="filter-price"
                />
                <div className="flex justify-between text-xs text-muted-dark mt-1">
                  <span>$50</span>
                  <span>$300</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">Minimum Rating</label>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-2 rounded-btn text-xs border transition-all duration-300 ${
                        minRating === r
                          ? 'border-gold bg-gold-100 text-gold'
                          : 'border-dark-500 text-muted hover:border-gold-200'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar + Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden btn-ghost !py-2.5 !px-4 flex items-center gap-2 text-sm"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-gold rounded-full text-dark-900 text-xs flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-dark-700 border border-dark-500 rounded-btn px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold transition-colors"
                  id="sort-select"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="bookings">Most Booked</option>
                </select>
              </div>
            </div>

            {/* Guide Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              </div>
            ) : filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGuides.map((guide, i) => (
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
                            <span>{guide.city}, {guide.country}</span>
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            <StarRating rating={guide.rating} size={13} />
                            <span className="text-muted-dark text-xs">({guide.reviewCount})</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-muted-dark text-xs mt-3">
                            <Languages size={12} />
                            <span>{guide.languages.join(' · ')}</span>
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
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-heading text-2xl text-cream mb-2">No guides found</h3>
                <p className="text-muted mb-6">Try adjusting your filters to see more results.</p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                   <button onClick={clearFilters} className="btn-gold">Clear All Filters</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-dark-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-semibold text-cream">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-muted hover:text-cream">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">City</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="input-dark text-sm">
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="input-dark text-sm">
                  <option value="">All Languages</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">Max Price: ${maxPrice}/day</label>
                <input type="range" min={50} max={300} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-gold" />
              </div>
              <div>
                <label className="text-sm font-medium text-cream mb-2 block">Min Rating</label>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map(r => (
                    <button key={r} onClick={() => setMinRating(r)} className={`px-3 py-2 rounded-btn text-xs border transition-all ${minRating === r ? 'border-gold bg-gold-100 text-gold' : 'border-dark-500 text-muted'}`}>
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={clearFilters} className="btn-ghost flex-1">Clear</button>
              <button onClick={() => setShowFilters(false)} className="btn-gold flex-1">Show {filteredGuides.length} Results</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
