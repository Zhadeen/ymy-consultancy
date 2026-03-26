import { Link } from 'react-router-dom';
import { Heart, Calendar, Star, MessageSquare, Settings, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import ScrollReveal from '../components/common/ScrollReveal';

export default function TouristDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('touristEmail', '==', user.email));
        const snap = await getDocs(q);
        setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
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
              <p className="text-muted mt-1">Manage your bookings and discover new guides.</p>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn-dark hidden sm:flex items-center gap-2 border-gold/50 text-gold">
                  Admin Panel
                </Link>
              )}
              <Link to="/search" className="btn-gold hidden sm:flex items-center gap-2">
                Find a Guide
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Stats */}
        <ScrollReveal delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { color: 'text-gold', icon: Calendar, label: 'Bookings', value: bookings.length },
              { color: 'text-pink-400', icon: Heart, label: 'Saved Guides', value: 0 },
              { color: 'text-yellow-400', icon: Star, label: 'Reviews Given', value: 0 },
              { color: 'text-blue-400', icon: MessageSquare, label: 'Messages', value: 0 },
            ].map(stat => (
              <div key={stat.label} className="card-dark p-5 text-center">
                <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-heading font-bold text-cream">{stat.value}</div>
                <div className="text-xs text-muted mt-1">{stat.label}</div>
              </div>
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
                    <div className="card-dark p-5 flex flex-col sm:flex-row sm:items-center gap-4">
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
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                          booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          'bg-gold-100 text-gold'
                        }`}>
                          {booking.status === 'confirmed' ? 'upcoming' : booking.status}
                        </span>
                        <span className="text-gold font-heading font-bold">${booking.totalPrice}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Saved Guides */}
          <div>
            <ScrollReveal>
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">Saved Guides</h2>
              <div className="space-y-3">
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
          </div>
        </div>
        <div className="mt-20 border-t border-dark-600/30 pt-10 text-center">
          <button 
            onClick={async () => {
              try {
                const { doc, updateDoc } = await import('firebase/firestore');
                await updateDoc(doc(db, 'users', user.uid), { role: 'admin' });
                alert('Success! Please refresh the page to see Admin Panel links.');
                window.location.reload();
              } catch (err) {
                console.error(err);
                alert('Failed: ' + err.message);
              }
            }}
            className="text-[10px] text-muted-dark hover:text-gold transition-colors underline decoration-dotted"
          >
            DEBUG: Elevate account to Admin
          </button>
        </div>
      </div>
    </main>
  );
}
