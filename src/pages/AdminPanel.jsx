import { useState, useEffect } from 'react';
import { Users, Globe, Calendar, Clock, Ban, BarChart3 } from 'lucide-react';
import { collection, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { PAID_BOOKING_STATUSES } from '../domain/constants/bookingStatus';
import { growthPercent, startOfCurrentMonth, countBefore, sumBefore } from '../domain/stats';
import { toDateSafe } from '../utils/timeUtils';
import { getAllUsers, updateUser } from '../infrastructure/firebase/repositories/usersRepository';
import { getAllGuides, createGuide } from '../infrastructure/firebase/repositories/guidesRepository';
import { getAllBookings } from '../infrastructure/firebase/repositories/bookingsRepository';
import { getAllApplicationsOrdered, deleteApplication } from '../infrastructure/firebase/repositories/guideApplicationsRepository';
import OverviewTab from './admin/OverviewTab';
import UsersTab from './admin/UsersTab';
import GuidesTab from './admin/GuidesTab';
import ApplicationsTab from './admin/ApplicationsTab';
import BookingsTab from './admin/BookingsTab';
import SystemTab from './admin/SystemTab';
import ApplicationDetailModal from './admin/ApplicationDetailModal';

// NOTE: handleWipeData below still uses raw Firestore access (collection/getDocs/writeBatch/db)
// rather than the repository layer. That's intentional — it's a destructive, cross-collection
// batch operation that doesn't fit the per-collection repository pattern, and this refactor
// deliberately left it untouched given the risk of a destructive admin function.

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'applications', label: 'Applications', icon: Clock },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'guides', label: 'Guides', icon: Globe },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'system', label: 'System', icon: Ban },
];

export default function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen] = useState(true);
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
        const [usersData, guidesData, bookingsData, applicationsData] = await Promise.all([
          getAllUsers(),
          getAllGuides(),
          getAllBookings(),
          getAllApplicationsOrdered()
        ]);
        setUsers(usersData);
        setGuides(guidesData);
        setBookings(bookingsData);
        setApplications(applicationsData);
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="pt-32 text-center text-cream min-h-screen bg-dark-900">Loading Dashboard...</div>;

  const paidBookings = bookings.filter(b => PAID_BOOKING_STATUSES.includes(b.status));

  const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // Compute monthly revenue dynamically
  const monthlyRevenueData = new Array(12).fill(0);
  paidBookings.forEach(b => {
    if (b.date) {
      const monthIndex = new Date(b.date).getMonth();
      if (monthIndex >= 0 && monthIndex <= 11) {
        monthlyRevenueData[monthIndex] += (b.totalPrice || 0);
      }
    }
  });

  // Real month-to-date growth, measured against where each total stood at the
  // start of this month. These cards used to display hardcoded "+12% / +8% /
  // +23% / +18%" that never changed and were always green, which is worse than
  // showing nothing. growthPercent returns null when there is no baseline, and
  // the card renders no badge in that case.
  const monthStart = startOfCurrentMonth();
  const growth = {
    users: growthPercent(users.length, countBefore(users, monthStart, 'createdAt', toDateSafe)),
    guides: growthPercent(guides.length, countBefore(guides, monthStart, 'createdAt', toDateSafe)),
    bookings: growthPercent(bookings.length, countBefore(bookings, monthStart, 'createdAt', toDateSafe)),
    revenue: growthPercent(totalRevenue, sumBefore(paidBookings, monthStart, 'createdAt', 'totalPrice', toDateSafe)),
  };

  const stats = {
    totalUsers: users.length,
    totalGuides: guides.length,
    totalBookings: bookings.length, // total gross bookings
    revenue: totalRevenue,
    monthlyRevenue: monthlyRevenueData,
    pendingGuides: applications.length
  };

  const maxRevenue = Math.max(...stats.monthlyRevenue, 100); // Give chart minimum scale
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleApprove = async (app) => {
    setActionLoading(app.id);
    try {
      // 1. Update user role to 'guide'
      await updateUser(app.uid, {
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

      await createGuide(app.uid, guideData);

      // 3. Remove application
      await deleteApplication(app.id);

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
      await deleteApplication(app.id);
      setApplications(prev => prev.filter(a => a.id !== app.id));
    } catch (err) {
      console.error("Rejection failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleDisabled = async (targetUser) => {
    const turningOff = !targetUser.disabled;
    const question = turningOff
      ? `Disable ${targetUser.email}? They will be signed out and blocked from signing in again until you re-enable them.`
      : `Re-enable ${targetUser.email}? They will be able to sign in again.`;
    if (!window.confirm(question)) return;

    setActionLoading(targetUser.id);
    try {
      await updateUser(targetUser.id, { disabled: turningOff });
      setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, disabled: turningOff } : u));
    } catch (err) {
      console.error('Failed to update account status:', err);
      alert('Could not update this account: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleWipeData = async () => {
    const collectionsToWipe = ['guides', 'bookings', 'guide_applications', 'reviews', 'chats', 'users'];
    const confirmed = window.confirm(
      "CRITICAL ACTION: This will delete ALL " + collectionsToWipe.join(', ') +
      " (except your own admin account). This cannot be undone. Are you absolutely sure?"
    );
    if (!confirmed) return;

    const doubleConfirmed = window.prompt("Type 'DELETE ALL' to confirm (caps sensitive):");
    if (doubleConfirmed !== 'DELETE ALL') return;

    // Track what actually got cleared. A failure partway through used to report
    // only "Wipe failed", which read as "nothing happened" while earlier
    // collections had already been destroyed.
    const cleared = [];

    setLoading(true);
    try {
      for (const collName of collectionsToWipe) {
        const snap = await getDocs(collection(db, collName));
        let batch = writeBatch(db);
        let count = 0;

        for (const d of snap.docs) {
          // Safeguard: Don't delete the current admin user
          if (collName === 'users' && d.id === currentUser?.uid) continue;

          // Recursive part for chats/messages subcollection
          if (collName === 'chats') {
            try {
              const messagesSnap = await getDocs(collection(db, 'chats', d.id, 'messages'));
              for (const msgDoc of messagesSnap.docs) {
                batch.delete(msgDoc.ref);
                count++;
                if (count >= 400) {
                  await batch.commit();
                  batch = writeBatch(db);
                  count = 0;
                }
              }
            } catch (chatErr) {
              console.warn(`Could not clear messages for chat ${d.id}:`, chatErr);
            }
          }

          batch.delete(d.ref);
          count++;

          if (count >= 400) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
          }
        }

        if (count > 0) {
          await batch.commit();
        }

        cleared.push(collName);
      }
      alert("Database wiped successfully. You have a clean slate!");
      window.location.reload();
    } catch (err) {
      console.error("Wipe failed:", err);
      // Say exactly how far it got. Deletes already committed are permanent, and
      // reporting a bare failure hides that.
      const done = cleared.length ? cleared.join(', ') : 'nothing';
      const remaining = collectionsToWipe.filter(c => !cleared.includes(c)).join(', ') || 'none';
      alert(
        `Wipe stopped partway.\n\n` +
        `Already deleted (permanently): ${done}\n` +
        `Not touched: ${remaining}\n\n` +
        `Reason: ${err.message}`
      );
      window.location.reload();
    } finally {
      setLoading(false);
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
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} growth={growth} maxRevenue={maxRevenue} months={months} onReviewGuides={() => setActiveTab('guides')} />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            currentUserId={currentUser?.uid}
            actionLoading={actionLoading}
            onToggleDisabled={handleToggleDisabled}
          />
        )}

        {activeTab === 'guides' && <GuidesTab guides={guides} />}

        {activeTab === 'applications' && (
          <ApplicationsTab
            applications={applications}
            actionLoading={actionLoading}
            onSelect={setSelectedApp}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}

        <ApplicationDetailModal
          app={selectedApp}
          actionLoading={actionLoading}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {activeTab === 'system' && <SystemTab onWipeData={handleWipeData} />}
      </div>
    </main>
  );
}
