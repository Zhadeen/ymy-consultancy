import { Calendar, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function AvailabilityTab({ calMonth, setCalMonth, availability, toggleDay, loading, onSave }) {
  const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calMonth.year, calMonth.month, 1).getDay();
  const monthName = new Date(calMonth.year, calMonth.month).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  return (
    <ScrollReveal>
      <div className="card-dark p-6 sm:p-8">
        <h2 className="font-heading text-xl font-bold text-cream mb-2 flex items-center gap-2">
          <Calendar size={20} className="text-gold" /> Manage Availability
        </h2>
        <p className="text-muted text-sm mb-6">Click on dates to mark them as available (gold) or unavailable.</p>

        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setCalMonth(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 })}
            className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-heading text-lg text-cream font-semibold">{monthName}</h3>
          <button
            type="button"
            onClick={() => setCalMonth(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 })}
            className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs text-muted-dark py-2 font-medium">{day}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(calMonth.year, calMonth.month, day);
            const isPast = date < new Date(new Date().setHours(0,0,0,0));
            const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isAvail = availability[dateStr];

            return (
              <button
                key={day}
                type="button"
                onClick={() => !isPast && toggleDay(dateStr)}
                disabled={isPast}
                className={`text-center py-3 rounded-lg text-sm font-medium transition-all ${
                  isPast
                    ? 'bg-transparent text-muted-dark opacity-30 cursor-not-allowed'
                    : isAvail
                      ? 'bg-gold text-dark-900 font-bold shadow-lg'
                      : 'bg-dark-700 text-muted hover:bg-dark-600 cursor-pointer'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-dark-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gold" />
            <span className="text-xs text-muted">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-dark-700" />
            <span className="text-xs text-muted">Unavailable</span>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button onClick={onSave} disabled={loading} className="btn-gold flex items-center gap-2 px-8">
            {loading ? 'Saving...' : <><Save size={18} /> Save Availability</>}
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
