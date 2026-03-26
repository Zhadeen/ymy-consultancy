import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/common/ScrollReveal';

export default function GuideDashboard() {
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        // Find guide doc by name for mock data compatibility, or by user.uid
        const guidesRef = collection(db, 'guides');
        const qG = query(guidesRef, where('name', '==', user.name)); // Temporary name match
        const snapG = await getDocs(qG);
        
        if (!snapG.empty) {
          const gData = { id: snapG.docs[0].id, ...snapG.docs[0].data() };
          setGuide(gData);

          // Get bookings for this guide
          const qB = query(collection(db, 'bookings'), where('guideId', '==', gData.id));
          const snapB = await getDocs(qB);
          setBookings(snapB.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="pt-32 text-center text-cream">Loading Dashboard...</div>;
  if (!guide) return <div className="pt-32 text-center text-cream">No Guide Profile Found. Please register/apply as a guide.</div>;

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <main className="pt-20 min-h-screen bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <img src={guide.photo} alt={guide.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold" />
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-cream">
                  Guide Dashboard
                </h1>
                <p className="text-muted flex items-center gap-1">
                  <MapPin size={14} /> {guide.city}, {guide.country}
                </p>
              </div>
            </div>
            <Link to={`/guide/${guide.id}`} className="btn-ghost flex items-center gap-2 text-sm">
              <Edit3 size={14} />
              Edit Profile
            </Link>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: DollarSign, label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, color: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: Calendar, label: 'Upcoming Tours', value: upcomingBookings.length, color: 'text-gold', bg: 'bg-gold-100' },
              { icon: Star, label: 'Rating', value: guide.rating.toFixed(1), color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: Users, label: 'Total Guests', value: guide.totalBookings, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            ].map(stat => (
              <div key={stat.label} className="card-dark p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
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
              <div className="flex gap-4 mb-6">
                {['upcoming', 'completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-btn text-sm font-medium transition-all duration-300 capitalize ${
                      activeTab === tab
                        ? 'bg-gold text-dark-900'
                        : 'bg-dark-700 text-muted hover:text-cream'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {(activeTab === 'upcoming' ? upcomingBookings : completedBookings).map((booking, i) => (
                  <ScrollReveal key={booking.id} delay={i * 60}>
                    <div className="card-dark p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-cream font-semibold">{booking.touristName}</h3>
                          <div className="flex items-center gap-4 text-muted text-sm mt-1">
                            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(booking.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><Clock size={14} />{booking.tourType}</span>
                            <span className="flex items-center gap-1"><Users size={14} />{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gold font-heading font-bold text-lg">${booking.totalPrice}</span>
                          <Link to="/chat" className="btn-ghost !py-2 !px-3 text-sm">
                            <MessageSquare size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
                {(activeTab === 'upcoming' ? upcomingBookings : completedBookings).length === 0 && (
                  <p className="text-muted text-center py-8">No {activeTab} bookings.</p>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Quick Actions */}
          <div>
            <ScrollReveal>
              <h2 className="font-heading text-xl font-bold text-cream mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: 'Manage Availability', to: '#' },
                  { icon: DollarSign, label: 'Update Pricing', to: '#' },
                  { icon: MessageSquare, label: 'Chat Inbox', to: '/chat' },
                  { icon: Settings, label: 'Account Settings', to: '#' },
                ].map(action => (
                  <Link key={action.label} to={action.to} className="card-dark p-4 flex items-center gap-3 group block">
                    <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center">
                      <action.icon size={18} className="text-gold" />
                    </div>
                    <span className="text-cream text-sm font-medium group-hover:text-gold transition-colors flex-1">{action.label}</span>
                    <ChevronRight size={16} className="text-muted-dark group-hover:text-gold transition-colors" />
                  </Link>
                ))}
              </div>
            </ScrollReveal>

            {/* Earnings breakout */}
            <ScrollReveal delay={80}>
              <div className="card-dark p-6 mt-6">
                <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-400" />
                  Earnings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">This month</span>
                    <span className="text-cream font-semibold">$1,240</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Last month</span>
                    <span className="text-cream font-semibold">$980</span>
                  </div>
                  <div className="h-px bg-dark-600" />
                  <div className="flex justify-between">
                    <span className="text-muted text-sm">All time</span>
                    <span className="text-gold font-heading font-bold">${totalEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
