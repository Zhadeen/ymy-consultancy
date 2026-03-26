import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Languages, Calendar, DollarSign } from 'lucide-react';
import { CITIES, LANGUAGES } from '../../data/mockData';

export default function Hero() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('');
  const [date, setDate] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (language) params.set('language', language);
    if (date) params.set('date', date);
    if (priceRange) params.set('price', priceRange);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
          alt="Travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/60 to-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/40 to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-dark-700/60 backdrop-blur-md border border-gold-200 rounded-full px-5 py-2 mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
          <span className="text-sm text-cream/90 font-medium">Trusted by 10,000+ travelers worldwide</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-cream mb-6 animate-slide-up leading-[1.1]">
          Your World.{' '}
          <span className="text-gradient-gold">Your Expert</span>
          {' '}Guide.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-cream/70 max-w-2xl mx-auto mb-12 animate-slide-up font-light leading-relaxed" style={{ animationDelay: '150ms' }}>
          Book verified, professional tour guides in minutes. Authentic experiences, local expertise, zero hassle.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="animate-slide-up bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-dark-500/50 p-3 max-w-4xl mx-auto"
          style={{ animationDelay: '300ms' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* City */}
            <div className="relative">
              <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-btn pl-10 pr-4 py-3.5 text-cream text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors"
                id="hero-city-select"
              >
                <option value="">Any City</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Language */}
            <div className="relative">
              <Languages size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-btn pl-10 pr-4 py-3.5 text-cream text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors"
                id="hero-language-select"
              >
                <option value="">Any Language</option>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="relative">
              <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-btn pl-10 pr-4 py-3.5 text-cream text-sm focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                id="hero-date-input"
              />
            </div>

            {/* Price Range */}
            <div className="relative">
              <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-btn pl-10 pr-4 py-3.5 text-cream text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors"
                id="hero-price-select"
              >
                <option value="">Any Price</option>
                <option value="0-100">Under $100</option>
                <option value="100-200">$100 – $200</option>
                <option value="200-300">$200 – $300</option>
                <option value="300+">$300+</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="btn-gold flex items-center justify-center gap-2 !py-3.5 w-full"
              id="hero-search-btn"
            >
              <Search size={18} />
              <span className="font-semibold">Search</span>
            </button>
          </div>
        </form>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '500ms' }}>
          {[
            { value: '500+', label: 'Expert Guides' },
            { value: '50+', label: 'Cities' },
            { value: '10K+', label: 'Happy Travelers' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-heading font-bold text-gold">{stat.value}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-gold animate-pulse" />
        </div>
      </div>
    </section>
  );
}
