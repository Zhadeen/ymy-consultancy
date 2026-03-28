import { useState, useEffect } from 'react';
import { Users, Globe, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, ChevronDown, Search, BarChart3, ArrowUpRight, ArrowDownRight, Eye, Ban, Trash2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import ScrollReveal from '../components/common/ScrollReveal';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'applications', label: 'Applications', icon: Clock },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'guides', label: 'Guides', icon: Globe },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [guides, setGuides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uSnap, gSnap, bSnap, aSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'guides')),
          getDocs(collection(db, 'bookings')),
          getDocs(query(collection(db, 'guide_applications'), orderBy('createdAt', 'desc')))
        ]);
        setUsers(uSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setGuides(gSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setBookings(bSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setApplications(aSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="pt-32 text-center text-cream min-h-screen bg-dark-900">Loading Dashboard...</div>;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const stats = {
    totalUsers: users.length,
    totalGuides: guides.length,
    totalBookings: bookings.length,
    revenue: totalRevenue,
    monthlyRevenue: new Array(12).fill(0), // Simplified
    pendingGuides: applications.length
  };

  const maxRevenue = Math.max(...stats.monthlyRevenue, 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleApprove = async (app) => {
    setActionLoading(app.id);
    try {
      const { doc, setDoc, updateDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore');
      
      // 1. Update user role to 'guide'
      await updateDoc(doc(db, 'users', app.uid), {
        role: 'guide'
      });

      // 2. Add to public guides collection with all required fields
      const guideData = {
        ...app,
        id: app.uid,
        uid: app.uid,
        name: app.name,
        city: app.city || 'Not specified',
        country: app.country || 'Not specified',
        countryCode: app.countryCode || '',
        photo: app.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
        bio: app.bio || '',
        languages: app.languages || [],
        specialties: app.specialties || '',
        priceHalfDay: app.priceHalfDay || 100,
        priceFullDay: app.priceFullDay || 150,
        priceCustom: app.priceCustom || 50,
        rating: 5.0,
        reviewCount: 0,
        totalBookings: 0,
        experience: 0,
        status: 'active',
        verified: true,
        idVerified: true,
        approvedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'guides', app.uid), guideData);

      // 3. Remove application
      await deleteDoc(doc(db, 'guide_applications', app.id));

      // 4. Update local state
      setApplications(prev => prev.filter(a => a.id !== app.id));
      setGuides(prev => [...prev, guideData]);
      // Update user role locally too
      setUsers(prev => prev.map(u => u.id === app.uid ? { ...u, role: 'guide' } : u));
      
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve application. Check console.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (app) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    setActionLoading(app.id);
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'guide_applications', app.id));
      setApplications(prev => prev.filter(a => a.id !== app.id));
    } catch (err) {
      console.error("Rejection failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-dark-800 border-r border-dark-600/50 flex-shrink-0 transition-all duration-300 hidden lg:flex flex-col`}>
        <div className="p-4">
          <h2 className={`font-heading text-lg font-bold text-cream ${!sidebarOpen && 'hidden'}`}>Admin</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gold-100 text-gold'
                  : 'text-muted hover:text-cream hover:bg-dark-700'
              }`}
            >
              <tab.icon size={18} />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600/50 z-40 flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
              activeTab === tab.id ? 'text-gold' : 'text-muted'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8 overflow-y-auto">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <ScrollReveal>
              <h1 className="font-heading text-3xl font-bold text-cream mb-8">Dashboard Overview</h1>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+12%', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Globe, label: 'Active Guides', value: stats.totalGuides, change: '+8%', up: true, color: 'text-green-400', bg: 'bg-green-500/10' },
                { icon: Calendar, label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), change: '+23%', up: true, color: 'text-gold', bg: 'bg-gold-100' },
                { icon: DollarSign, label: 'Revenue', value: `$${(stats.revenue / 1000).toFixed(0)}K`, change: '+18%', up: true, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 60}>
                  <div className="card-dark p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon size={18} className={stat.color} />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-2xl font-heading font-bold text-cream">{stat.value}</div>
                    <div className="text-xs text-muted mt-1">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Revenue Chart */}
            <ScrollReveal delay={240}>
              <div className="card-dark p-6">
                <h3 className="font-heading text-xl font-bold text-cream mb-6">Monthly Revenue</h3>
                <div className="flex items-end gap-2 h-48">
                  {stats.monthlyRevenue.map((rev, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-muted">${(rev / 1000).toFixed(0)}K</span>
                      <div
                        className="w-full bg-gradient-to-t from-gold to-gold-light rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{ height: `${(rev / maxRevenue) * 150}px` }}
                      />
                      <span className="text-[10px] text-muted-dark">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Pending Guides Alert */}
            {stats.pendingGuides > 0 && (
              <ScrollReveal delay={300}>
                <div className="mt-6 bg-gold-100 border border-gold-200 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-gold" />
                    <span className="text-cream font-medium">{stats.pendingGuides} guide applications awaiting review</span>
                  </div>
                  <button onClick={() => setActiveTab('guides')} className="btn-gold text-sm !py-2">
                    Review
                  </button>
                </div>
              </ScrollReveal>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <ScrollReveal>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading text-3xl font-bold text-cream">Users</h1>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark" />
                  <input placeholder="Search users..." className="input-dark !pl-9 !py-2.5 text-sm w-64" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="card-dark overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Name</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Email</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Join Date</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Status</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr key={user.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                          <td className="px-5 py-4 text-cream text-sm font-medium">{user.name}</td>
                          <td className="px-5 py-4 text-muted text-sm">{user.email}</td>
                          <td className="px-5 py-4 text-muted text-sm">{user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'New'}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider bg-green-500/10 text-green-400">
                              Active
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-cream transition-colors" title="View">
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Guides */}
        {activeTab === 'guides' && (
          <div>
            <ScrollReveal>
              <h1 className="font-heading text-3xl font-bold text-cream mb-6">Guides</h1>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="card-dark overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Guide</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">City</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Rating</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Status</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guides.map((guide, i) => (
                        <tr key={guide.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={guide.photo} alt={guide.name} className="w-9 h-9 rounded-full object-cover border border-dark-500" />
                              <span className="text-cream text-sm font-medium">{guide.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-muted text-sm">{guide.city}</td>
                          <td className="px-5 py-4 text-gold text-sm font-semibold">{guide.rating}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider bg-green-500/10 text-green-400">
                              Approved
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-cream transition-colors" title="View">
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Applications */}
        {activeTab === 'applications' && (
          <div>
            <ScrollReveal>
              <h1 className="font-heading text-3xl font-bold text-cream mb-6">Guide Applications</h1>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6">
              {applications.length === 0 ? (
                <div className="card-dark p-12 text-center">
                  <Clock size={48} className="text-muted-dark mx-auto mb-4" />
                  <p className="text-muted">No pending applications at the moment.</p>
                </div>
              ) : (
                applications.map((app, i) => (
                  <ScrollReveal key={app.id} delay={i * 50}>
                    <div className="card-dark p-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:border-gold/50 transition-colors" onClick={() => setSelectedApp(app)}>
                      <img src={app.photo} alt={app.name} className="w-32 h-32 rounded-2xl object-cover border border-dark-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-heading text-xl font-bold text-cream">{app.name}</h3>
                          <span className="text-xs font-semibold px-2 px-1 text-gold bg-gold-100 rounded-full uppercase">Pending Review</span>
                        </div>
                        <p className="text-muted text-sm mb-4 line-clamp-2">{app.bio}</p>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 text-xs">
                          <div><span className="text-muted-dark block">Location</span><span className="text-cream">{app.city}</span></div>
                          <div><span className="text-muted-dark block">Languages</span><span className="text-cream">{app.languages?.join(', ')}</span></div>
                          <div><span className="text-muted-dark block">Pricing</span><span className="text-gold font-bold">${app.priceHalfDay} / ${app.priceFullDay}</span></div>
                          <div><span className="text-muted-dark block">Email</span><span className="text-cream">{app.email}</span></div>
                          <div>
                            <span className="text-muted-dark block">ID Verification</span>
                            <a 
                              href={app.idDocumentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gold hover:text-gold-light flex items-center gap-1 mt-0.5 font-medium underline"
                            >
                              <Eye size={12} /> View {app.idType}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleApprove(app)} 
                            disabled={actionLoading === app.id}
                            className="btn-gold !py-2 !px-6 text-sm flex items-center gap-2"
                          >
                            {actionLoading === app.id ? 'Processing...' : <><CheckCircle size={16} /> Approve Application</>}
                          </button>
                          <button 
                            onClick={() => handleReject(app)}
                            disabled={actionLoading === app.id}
                            className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-2 px-4"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))
              )}
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedApp(null)}>
            <div className="card-dark max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-cream">Application Details</h2>
                <button onClick={() => setSelectedApp(null)} className="text-muted hover:text-cream text-2xl">&times;</button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img src={selectedApp.photo} alt={selectedApp.name} className="w-40 h-40 rounded-2xl object-cover border-2 border-gold" />
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-bold text-cream mb-1">{selectedApp.name}</h3>
                  <p className="text-gold text-sm mb-3">Pending Review</p>
                  <p className="text-muted text-sm">{selectedApp.bio || 'No bio provided'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="card-dark !bg-dark-600 p-4">
                  <span className="text-muted-dark block text-xs mb-1">Email</span>
                  <span className="text-cream">{selectedApp.email}</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4">
                  <span className="text-muted-dark block text-xs mb-1">Phone</span>
                  <span className="text-cream">{selectedApp.phoneCode} {selectedApp.phone}</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4">
                  <span className="text-muted-dark block text-xs mb-1">Country</span>
                  <span className="text-cream">{selectedApp.country} ({selectedApp.countryCode})</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4">
                  <span className="text-muted-dark block text-xs mb-1">City</span>
                  <span className="text-cream">{selectedApp.city || 'Not specified'}</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4">
                  <span className="text-muted-dark block text-xs mb-1">Languages</span>
                  <span className="text-cream">{selectedApp.languages?.join(', ') || 'Not specified'}</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4">
                  <span className="text-muted-dark block text-xs mb-1">Specialties</span>
                  <span className="text-cream">{selectedApp.specialties || 'Not specified'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card-dark !bg-dark-600 p-4 text-center">
                  <span className="text-muted-dark block text-xs mb-1">Half Day</span>
                  <span className="text-gold font-bold text-lg">${selectedApp.priceHalfDay || '—'}</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4 text-center">
                  <span className="text-muted-dark block text-xs mb-1">Full Day</span>
                  <span className="text-gold font-bold text-lg">${selectedApp.priceFullDay || '—'}</span>
                </div>
                <div className="card-dark !bg-dark-600 p-4 text-center">
                  <span className="text-muted-dark block text-xs mb-1">Custom (/hr)</span>
                  <span className="text-gold font-bold text-lg">${selectedApp.priceCustom || '—'}</span>
                </div>
              </div>

              <div className="card-dark !bg-dark-600 p-4 mb-6">
                <span className="text-muted-dark block text-xs mb-2">ID Document</span>
                {selectedApp.idDocumentUrl ? (
                  <a 
                    href={selectedApp.idDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-gold inline-flex items-center gap-2"
                  >
                    <Eye size={16} /> View {selectedApp.idType || 'ID Document'}
                  </a>
                ) : (
                  <span className="text-red-400">No ID document uploaded</span>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-dark-600">
                <button 
                  onClick={() => { handleApprove(selectedApp); setSelectedApp(null); }} 
                  disabled={actionLoading === selectedApp.id}
                  className="btn-gold flex-1 !py-3 flex items-center justify-center gap-2"
                >
                  {actionLoading === selectedApp.id ? 'Processing...' : <><CheckCircle size={18} /> Approve Application</>}
                </button>
                <button 
                  onClick={() => { handleReject(selectedApp); setSelectedApp(null); }}
                  disabled={actionLoading === selectedApp.id}
                  className="flex-1 py-3 px-6 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <ScrollReveal>
              <h1 className="font-heading text-3xl font-bold text-cream mb-6">Bookings</h1>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="card-dark overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Reference</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Tourist</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Guide</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Date</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Status</th>
                        <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, i) => (
                        <tr key={booking.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                          <td className="px-5 py-4 text-gold font-mono text-sm">{booking.reference}</td>
                          <td className="px-5 py-4 text-cream text-sm">{booking.touristName}</td>
                          <td className="px-5 py-4 text-muted text-sm">{booking.guideName}</td>
                          <td className="px-5 py-4 text-muted text-sm">{new Date(booking.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                              'bg-gold-100 text-gold'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-cream text-sm font-semibold">${booking.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </main>
  );
}
