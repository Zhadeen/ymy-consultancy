import { Link } from 'react-router-dom';
import { MapPin, Languages, Calendar, Clock, BadgeCheck, Award, MessageSquare, ChevronLeft, Users } from 'lucide-react';
import StarRating from '../../components/common/StarRating';
import { getGuideLocalTime } from '../../utils/timeUtils';

function formatList(item) {
  if (!item) return [];
  if (Array.isArray(item)) return item;
  if (typeof item === 'string') return item.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

export default function ProfileHero({ guide, isOwnProfile, isBookable, onBook, onMessage }) {
  return (
    <div className="relative bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/search" className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors mb-8">
          <ChevronLeft size={16} />
          <span className="text-sm">Back to Search</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Photo */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="relative">
              <img
                src={guide.photo}
                alt={guide.name}
                className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-dark-500"
              />
              {guide.idVerified && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gold rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-gold-glow">
                  <BadgeCheck size={16} className="text-dark-900" />
                  <span className="text-dark-900 text-sm font-bold">Verified Local Guide</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream mb-2">
              {guide.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted mb-6">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {guide.country}, {guide.city}
              </span>
              <span className="flex items-center gap-1.5 text-gold font-medium bg-gold/5 px-2 py-0.5 rounded-lg border border-gold/10">
                <Clock size={16} />
                {getGuideLocalTime(guide.country)} (Local Time)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} />
                {guide.experience} years experience
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                {guide.totalBookings} experiences completed
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={guide.rating} size={18} />
              <span className="text-muted text-sm">({guide.reviewCount} reviews)</span>
            </div>

            <p className="text-cream/80 leading-relaxed mb-8 text-lg">{guide.bio}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {formatList(guide.languages).map(lang => (
                <span key={lang} className="bg-dark-700 border border-dark-500 rounded-full px-4 py-1.5 text-sm text-cream flex items-center gap-1.5">
                  <Languages size={14} className="text-gold" />
                  {lang}
                </span>
              ))}
              {formatList(guide.specialties).map(spec => (
                <span key={spec} className="bg-gold-100 border border-gold-200 rounded-full px-4 py-1.5 text-sm text-gold flex items-center gap-1.5">
                  <Award size={14} />
                  {spec}
                </span>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden flex gap-3">
              {isOwnProfile ? (
                <Link to="/settings?tab=guide" className="btn-gold flex-1 flex items-center justify-center gap-2">
                  Edit My Profile
                </Link>
              ) : (
                <>
                  {isBookable ? (
                    <button onClick={onBook} className="btn-gold flex-1 flex items-center justify-center gap-2">
                      <Calendar size={18} /> Book This Guide
                    </button>
                  ) : (
                    <button disabled className="btn-ghost flex-1 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                      <Calendar size={18} /> Unavailable
                    </button>
                  )}
                  <Link to="#" onClick={(e) => { e.preventDefault(); onMessage(); }} className="btn-ghost flex items-center gap-2 !px-4 hover:text-gold transition-colors">
                    <MessageSquare size={18} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
