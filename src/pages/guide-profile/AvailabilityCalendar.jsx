import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function AvailabilityCalendar({ guide, calMonth, onPrevMonth, onNextMonth }) {
  const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calMonth.year, calMonth.month, 1).getDay();
  const monthName = new Date(calMonth.year, calMonth.month).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const isAvailable = (day) => {
    if (!guide || !guide.availability) return true;
    const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return guide.availability[dateStr];
  };

  return (
    <ScrollReveal>
      <h2 className="font-heading text-2xl font-bold text-cream mb-6">Availability</h2>
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onPrevMonth} className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-heading text-lg text-cream font-semibold">{monthName}</h3>
          <button onClick={onNextMonth} className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs text-muted-dark py-2 font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfWeek }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const available = isAvailable(day);
            return (
              <div
                key={day}
                className={`text-center py-2.5 rounded-lg text-sm transition-all cursor-default ${
                  available
                    ? 'bg-gold-100 text-gold font-semibold hover:bg-gold-200'
                    : 'text-muted-dark'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dark-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gold-100" />
            <span className="text-xs text-muted">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-dark-600" />
            <span className="text-xs text-muted">Unavailable</span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
