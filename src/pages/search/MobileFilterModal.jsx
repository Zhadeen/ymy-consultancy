import { X } from 'lucide-react';
import { COUNTRIES, LANGUAGES } from '../../data/mockData';

export default function MobileFilterModal({
  show, onClose,
  country, setCountry,
  city, setCity,
  language, setLanguage,
  maxPrice, setMaxPrice,
  minRating, setMinRating,
  onClear, filteredCount
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-dark-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-semibold text-cream">Filters</h3>
          <button onClick={onClose} className="text-muted hover:text-cream">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-cream mb-2 block">Country</label>
            <select value={country} onChange={e => { setCountry(e.target.value); setCity(''); }} className="input-dark text-sm">
              <option value="">All Countries</option>
              {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-cream mb-2 block">City</label>
            <input
              type="text"
              placeholder="Type a city..."
              value={city}
              onChange={e => setCity(e.target.value)}
              className="input-dark text-sm"
            />
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
          <button onClick={onClear} className="btn-ghost flex-1">Clear</button>
          <button onClick={onClose} className="btn-gold flex-1">Show {filteredCount} Results</button>
        </div>
      </div>
    </div>
  );
}
