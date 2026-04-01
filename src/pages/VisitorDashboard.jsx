import { Link } from 'react-router-dom';
import { Heart, Calendar, Star, MessageSquare, Settings, ChevronRight, MapPin, CheckCircle2, CreditCard, AlertCircle, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import ScrollReveal from '../components/common/ScrollReveal';
import { useUnreadCount } from '../hooks/useUnreadCount';
import SessionTracker from '../components/dashboard/SessionTracker';
import ReviewModal from '../components/dashboard/ReviewModal';

export default function VisitorDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = useUnreadCount();
  const [reviewBookingTarget, setReviewBookingTarget] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let unsubscribeBookings;
    
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('visitorId', '==', user.uid));
        unsubscribeBookings = onSnapshot(q, (snap) => {
          setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      }
    };
    fetchBookings();
    
    return () => {
      if (unsubscribeBookings) unsubscribeBookings();
    };
  }, [user]);

  const savedGuides = []; // Empty for now until saved guides feature is implemented

  if (loading) {
    return (
      <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream">
                Welcome back, {user?.name || 'Traveler'} 👋
              </h1>
              <p className="text-muted mt-1">Manage your bookings and discover Local Guides.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-bold bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20 uppercase tracking-wider">
                  <CheckCircle2 size={12} /> Visitor Account
                </span>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn-dark hidden sm:flex items-center gap-2 border-gold/50 text-gold">
                    Admin Panel
                  </Link>
                )}
              </div>
              <Link to="/search" className="btn-gold hidden sm:flex items-center gap-2">
                Find a Local Guide
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Email Verification Banner */}
        {user && !user.emailVerified && (
          <ScrollReveal>
            <div className="mb-8 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-yellow-300 font-semibold text-sm">Verify your email address</p>
                  <p className="text-yellow-400/70 text-xs">Check your inbox for a verification link to unlock all features.</p>
                </div>
              </div>
              <button 
                onClick={async () => {
                  try {
                    if (auth.currentUser) {
                      await sendEmailVerification(auth.currentUser);
                      alert('Verification email sent! Check your inbox.');
                    }
                  } catch (err) {
                    alert('Please wait a moment before requesting another verification email.');
                  }
                }}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-bold rounded-xl border border-yellow-500/30 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <Mail size={14} /> Resend Verification
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* Quick Stats */}
        <ScrollReveal delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { color: 'text-gold', icon: Calendar, label: 'Bookings', value: bookings.length },
              { color: 'text-pink-400', icon: Heart, label: 'Saved Local Guides', value: savedGuides.length, href: '#saved-guides' },
              { color: 'text-yellow-400', icon: Star, label: 'Reviews Given', value: 0 },
              { color: 'text-blue-400', icon: MessageSquare, label: 'Messages', value: unreadCount, href: '/chat' },
            ].map(stat => (
              <ScrollReveal key={stat.label}>
                {stat.href ? (
                  stat.href.startsWith('#') ? (
                    <div 
                      onClick={() => document.getElementById(stat.href.substring(1))?.scrollIntoView({ behavior: 'smooth' })}
                      className="card-dark p-5 text-center flex flex-col items-center justify-center hover:bg-dark-700/50 transition-colors cursor-pointer group h-full"
                    >
                      <stat.icon size={24} className={`${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                      <div className="text-2xl font-heading font-bold text-cream">{stat.value}</div>
                      <div className="text-xs text-muted mt-1">{stat.label}</div>
                    </div>
                  ) : (
                    <Link to={stat.href} className="card-dark p-5 text-center flex flex-col items-center justify-center hover:bg-dark-700/50 transition-colors cursor-pointer group h-full">
                      <stat.icon size={24} className={`${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                      <div className="text-2xl font-heading font-bold text-cream">{stat.value}</div>
                      <div className="text-xs text-muted mt-1">{stat.label}</div>
                    </Link>
                  )
                ) : (
                  <div className="card-dark p-5 text-center flex flex-col items-center justify-center h-full">
                    <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-heading font-bold text-cream">{stat.value}</div>
                    <div className="text-xs text-muted mt-1">{stat.label}</div>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">Your Bookings</h2>
              <div className="space-y-4">
                {bookings.map((booking, i) => (
                  <ScrollReveal key={booking.id} delay={i * 60}>
                    <div className="card-dark flex flex-col p-5 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            booking.status === 'completed' ? 'bg-green-500/10' :
                            booking.status === 'upcoming' ? 'bg-gold-100' : 'bg-blue-500/10'
                          }`}>
                            <Calendar size={20} className={
                              booking.status === 'completed' ? 'text-green-500' :
                              booking.status === 'upcoming' ? 'text-gold' : 'text-blue-400'
                            } />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-cream font-semibold truncate">{booking.guideName}</h3>
                            <p className="text-muted text-sm">
                              {new Date(booking.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {' · '}{booking.tourType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center sm:justify-end gap-4 flex-shrink-0">
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                            booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                            'bg-gold-100 text-gold'
                          }`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          <span className="text-gold font-heading font-bold">${booking.totalPrice}</span>
                        </div>
                      </div>
                      <SessionTracker 
                        booking={booking} 
                        role="visitor" 
                        onReviewClick={(b) => setReviewBookingTarget(b)} 
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Saved Local Guides */}
          <div id="saved-guides">
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">Saved Local Guides</h2>
              <div className="space-y-3 mb-10">
                {savedGuides.length > 0 ? savedGuides.map((guide, i) => (
                  <ScrollReveal key={guide.id} delay={i * 60}>
                    <Link to={`/guide/${guide.id}`} className="card-dark p-4 flex items-center gap-3 group block">
                      <img src={guide.photo} alt={guide.name} className="w-12 h-12 rounded-full object-cover border border-dark-500" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-cream font-medium text-sm group-hover:text-gold transition-colors truncate">{guide.name}</h4>
                        <div className="flex items-center gap-1 text-muted-dark text-xs">
                          <MapPin size={10} />
                          <span>{guide.city}</span>
                        </div>
                      </div>
                      <StarRating rating={guide.rating} size={12} showValue={false} />
                    </Link>
                  </ScrollReveal>
                )) : (
                  <div className="card-dark p-6 text-center text-muted">No saved guides yet.</div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-cream mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, label: 'Chat Inbox', to: '/chat' },
                  { icon: Settings, label: 'Account Settings', to: '/settings' },
                ].map(action => (
                  <Link key={action.label} to={action.to} className="card-dark p-4 flex items-center gap-3 group block">
                    <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0">
                      <action.icon size={18} className="text-gold" />
                    </div>
                    <span className="text-cream text-sm font-medium group-hover:text-gold transition-colors flex-1">{action.label}</span>
                    {action.label === 'Chat Inbox' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full mr-2">
                        {unreadCount}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-muted-dark group-hover:text-gold transition-colors" />
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={!!reviewBookingTarget}
        close={() => setReviewBookingTarget(null)}
        booking={reviewBookingTarget}
        reviewerRole="visitor"
        reviewer={user}
      />
    </main>
  );
}
