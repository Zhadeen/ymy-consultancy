import { COUNTRIES, LANGUAGES } from '../../data/mockData';

export default function FilterSidebar({
  country, setCountry,
  city, setCity,
  language, setLanguage,
  maxPrice, setMaxPrice,
  minRating, setMinRating,
  activeFilterCount, onClear
}) {
  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-cream">Filters</h3>
          {activeFilterCount > 0 && (
            <button onClick={onClear} className="text-xs text-gold hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="text-sm font-medium text-cream mb-2 block">Country</label>
          <select value={country} onChange={e => { setCountry(e.target.value); setCity(''); }} className="input-dark text-sm" id="filter-country">
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="text-sm font-medium text-cream mb-2 block">City</label>
          <input
            type="text"
            placeholder="Type a city..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="input-dark text-sm"
            id="filter-city"
          />
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
  );
}
