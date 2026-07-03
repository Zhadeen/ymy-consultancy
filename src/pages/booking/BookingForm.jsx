import { Calendar, Users, Clock, MapPin, CreditCard, Info, Star } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import { VISIT_PURPOSES, LOCAL_EXPERIENCES } from '../../data/mockData';
import { getGuideLocalTime } from '../../utils/timeUtils';

const tourTypes = [
  { value: 'half', label: 'Half Day', sublabel: '4 hours', icon: '🌤️' },
  { value: 'full', label: 'Full Day', sublabel: '8 hours', icon: '☀️' },
  { value: 'custom', label: 'Custom', sublabel: 'Flexible', icon: '✨' },
];

export default function BookingForm({
  guide, availableDates,
  date, setDate,
  tourType, setTourType,
  guests, setGuests,
  visitPurpose, setVisitPurpose,
  localExperience, setLocalExperience,
  name, setName,
  email, setEmail,
  specialRequests, setSpecialRequests
}) {
  return (
    <div className="flex-1 space-y-8">
      <ScrollReveal>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">
          Book Your Local Guide Experience
        </h1>
        <div className="flex items-center gap-3 text-muted">
          <img src={guide.photo} alt={guide.name} className="w-10 h-10 rounded-full object-cover border border-dark-500" />
          <div>
            <span className="text-cream font-medium">{guide.name}</span>
            <div className="flex items-center gap-3 text-xs mt-0.5">
              <span className="flex items-center gap-1"><MapPin size={12} />{guide.city}</span>
              <span className="flex items-center gap-1 text-gold"><Clock size={12} /> {getGuideLocalTime(guide.country)} (Local Time)</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Date */}
      <ScrollReveal delay={80}>
        <label className="block">
          <span className="text-cream font-semibold mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-gold" />
            Select Date
          </span>
          {availableDates.length > 0 ? (
            <select value={date} onChange={e => setDate(e.target.value)} className="input-dark mt-2" id="booking-date">
              <option value="">Choose an available date</option>
              {availableDates.map(d => {
                // Parse correctly without timezone shift
                const [year, month, day] = d.split('-').map(Number);
                const localDateObj = new Date(year, month - 1, day);
                return (
                  <option key={d} value={d}>
                    {localDateObj.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </option>
                );
              })}
            </select>
          ) : (
            <div className="bg-dark-600 border border-dark-500 rounded-xl p-4 text-center mt-2">
              <p className="text-muted text-sm">This guide is fully booked or no dates are currently available.</p>
            </div>
          )}
        </label>
      </ScrollReveal>

      {/* Tour Type */}
      <ScrollReveal delay={160}>
        <span className="text-cream font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} className="text-gold" />
          Tour Type
        </span>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {tourTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setTourType(type.value)}
              className={`card-dark p-4 text-center transition-all duration-300 cursor-pointer ${
                tourType === type.value ? 'border-gold bg-gold-50' : ''
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-cream font-semibold text-sm">{type.label}</div>
              <div className="text-muted-dark text-xs">{type.sublabel}</div>
              <div className="text-gold font-heading font-bold mt-2">
                ${type.value === 'half' ? guide.priceHalfDay : type.value === 'full' ? guide.priceFullDay : guide.priceCustom * 4}
              </div>
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Guests */}
      <ScrollReveal delay={240}>
        <label className="block">
          <span className="text-cream font-semibold mb-3 flex items-center gap-2">
            <Users size={18} className="text-gold" />
            Number of Guests
          </span>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-12 h-12 rounded-btn border border-dark-500 text-cream text-xl hover:border-gold transition-colors">−</button>
            <span className="text-2xl font-heading font-bold text-cream w-12 text-center">{guests}</span>
            <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-12 h-12 rounded-btn border border-dark-500 text-cream text-xl hover:border-gold transition-colors">+</button>
          </div>
        </label>
      </ScrollReveal>

      {/* Visit Purpose */}
      <ScrollReveal delay={280}>
        <div className="space-y-6">
          <div>
            <span className="text-cream font-semibold mb-3 flex items-center gap-2">
              <Info size={18} className="text-gold" />
              Why are you visiting?
            </span>
            <select
              value={visitPurpose}
              onChange={e => setVisitPurpose(e.target.value)}
              className="input-dark mt-2"
              id="visit-purpose"
            >
              <option value="">Select your primary purpose</option>
              {VISIT_PURPOSES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-cream font-semibold mb-3 flex items-center gap-2">
              <Star size={18} className="text-gold" />
              Add a local experience? (Optional)
            </span>
            <select
              value={localExperience}
              onChange={e => setLocalExperience(e.target.value)}
              className="input-dark mt-2"
              id="local-experience"
            >
              <option value="">No local experience needed</option>
              {LOCAL_EXPERIENCES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <p className="text-muted-dark text-[11px] mt-1 italic">
              Guides can better prepare your itinerary if they know your interests.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Details */}
      <ScrollReveal delay={320}>
        <h2 className="text-cream font-semibold mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-gold" />
          Your Details
        </h2>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="input-dark" id="booking-name" />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="input-dark" id="booking-email" />
          <textarea placeholder="Special requests or notes for your guide..." rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} className="input-dark resize-none" id="booking-requests" />
        </div>
      </ScrollReveal>
    </div>
  );
}
