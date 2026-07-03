import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { getAllGuides } from '../infrastructure/firebase/repositories/guidesRepository';
import FilterSidebar from './search/FilterSidebar';
import MobileFilterModal from './search/MobileFilterModal';
import GuideGrid from './search/GuideGrid';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
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
        const guidesData = await getAllGuides();
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
    if (country) guides = guides.filter(g => g.country === country);
    if (city) guides = guides.filter(g => (g.city || '').toLowerCase().includes(city.toLowerCase()));
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
  }, [allGuides, country, city, language, maxPrice, minRating, sortBy]);

  const clearFilters = () => {
    setCountry('');
    setCity('');
    setLanguage('');
    setMaxPrice(300);
    setMinRating(0);
    setSearchParams({});
  };

  const activeFilterCount = [country, city, language, maxPrice < 300, minRating > 0].filter(Boolean).length;

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">
            Find Your Local Guide
          </h1>
          <p className="text-muted">
            {filteredGuides.length} {filteredGuides.length === 1 ? 'Local Guide' : 'Local Guides'} available
            {country ? ` in ${country}` : city ? ` in ${city}` : ' worldwide'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <FilterSidebar
            country={country} setCountry={setCountry}
            city={city} setCity={setCity}
            language={language} setLanguage={setLanguage}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            minRating={minRating} setMinRating={setMinRating}
            activeFilterCount={activeFilterCount}
            onClear={clearFilters}
          />

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

            <GuideGrid loading={loading} guides={filteredGuides} onClearFilters={clearFilters} />
          </div>
        </div>
      </div>

      <MobileFilterModal
        show={showFilters}
        onClose={() => setShowFilters(false)}
        country={country} setCountry={setCountry}
        city={city} setCity={setCity}
        language={language} setLanguage={setLanguage}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        minRating={minRating} setMinRating={setMinRating}
        onClear={clearFilters}
        filteredCount={filteredGuides.length}
      />
    </main>
  );
}
