import { useState } from 'react';
import { Users, Globe, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, ChevronDown, Search, BarChart3, ArrowUpRight, ArrowDownRight, Eye, Ban, Trash2 } from 'lucide-react';
import { mockGuides, mockBookings, mockAdminStats } from '../data/mockData';
import ScrollReveal from '../components/common/ScrollReveal';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'guides', label: 'Guides', icon: Globe },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = mockAdminStats;

  // Simple revenue chart
  const maxRevenue = Math.max(...stats.monthlyRevenue);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                      {[
                        { name: 'Laura Stevens', email: 'laura@email.com', date: 'Jan 5, 2026', status: 'active' },
                        { name: 'Alex Rodriguez', email: 'alex@email.com', date: 'Jan 12, 2026', status: 'active' },
                        { name: 'Emma Laurent', email: 'emma@email.com', date: 'Feb 1, 2026', status: 'active' },
                        { name: 'Thomas Brown', email: 'thomas@email.com', date: 'Feb 8, 2026', status: 'suspended' },
                        { name: 'Julia Weber', email: 'julia@email.com', date: 'Feb 15, 2026', status: 'active' },
                      ].map((user, i) => (
                        <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                          <td className="px-5 py-4 text-cream text-sm font-medium">{user.name}</td>
                          <td className="px-5 py-4 text-muted text-sm">{user.email}</td>
                          <td className="px-5 py-4 text-muted text-sm">{user.date}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-cream transition-colors" title="View">
                                <Eye size={14} />
                              </button>
                              <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-yellow-400 transition-colors" title="Suspend">
                                <Ban size={14} />
                              </button>
                              <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-red-400 transition-colors" title="Delete">
                                <Trash2 size={14} />
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
                      {mockGuides.slice(0, 8).map((guide, i) => (
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
                              <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-yellow-400 transition-colors" title="Suspend">
                                <Ban size={14} />
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
                      {mockBookings.map((booking, i) => (
                        <tr key={booking.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                          <td className="px-5 py-4 text-gold font-mono text-sm">{booking.reference}</td>
                          <td className="px-5 py-4 text-cream text-sm">{booking.touristName}</td>
                          <td className="px-5 py-4 text-muted text-sm">{booking.guideName}</td>
                          <td className="px-5 py-4 text-muted text-sm">{new Date(booking.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                              booking.status === 'upcoming' ? 'bg-gold-100 text-gold' : 'bg-blue-500/10 text-blue-400'
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
