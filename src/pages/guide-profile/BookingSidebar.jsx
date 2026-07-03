import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, User } from 'lucide-react';

export default function BookingSidebar({ guide, isOwnProfile, isBookable, onBook, onMessage }) {
  return (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-28">
        <div className="card-dark p-6 border-gold-200">
          {isOwnProfile ? (
            <>
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-3">
                  <User size={24} className="text-gold" />
                </div>
                <p className="text-cream font-semibold text-sm">This is your public profile</p>
                <p className="text-muted-dark text-xs mt-1">This is how visitors see you.</p>
              </div>
              <Link to="/settings?tab=guide" className="btn-gold w-full flex items-center justify-center gap-2 !py-3">
                Edit My Profile
              </Link>
              <Link to="/settings?tab=availability" className="btn-ghost w-full flex items-center justify-center gap-2 mt-3">
                <Calendar size={18} /> Manage Availability
              </Link>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="text-3xl font-heading font-bold text-gold">${guide.priceFullDay}</span>
                <span className="text-muted text-sm"> / day</span>
              </div>

              {isBookable ? (
                <button onClick={onBook} id="book-guide-btn" className="btn-gold w-full flex items-center justify-center gap-2 text-lg !py-4 animate-pulse-gold min-h-[60px]">
                  <Calendar size={20} /> Book This Guide
                </button>
              ) : (
                <div className="bg-dark-600 border border-dark-500 rounded-xl p-4 text-center min-h-[60px] flex flex-col justify-center">
                  <p className="text-muted text-sm flex items-center justify-center gap-2 font-medium">
                    <Calendar size={16} /> Unavailable to Book
                  </p>
                </div>
              )}

              <button onClick={onMessage} className="btn-ghost w-full flex items-center justify-center gap-2 mt-3">
                <MessageSquare size={18} /> Send Message
              </button>

              <div className="mt-6 pt-6 border-t border-dark-600 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Response time</span>
                  <span className="text-cream font-medium">Under 1 hour</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Cancellation</span>
                  <span className="text-cream font-medium">Free up to 24h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Languages</span>
                  <span className="text-cream font-medium">{(guide.languages || []).length}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
