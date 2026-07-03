import { Users, Globe, Calendar, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import { formatCurrency } from '../../utils/formatters';

export default function OverviewTab({ stats, maxRevenue, months, onReviewGuides }) {
  return (
    <div>
      <ScrollReveal>
        <h1 className="font-heading text-3xl font-bold text-cream mb-8">Dashboard Overview</h1>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+12%', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Globe, label: 'Active Guides', value: stats.totalGuides, change: '+8%', up: true, color: 'text-green-400', bg: 'bg-green-500/10' },
          { icon: Calendar, label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), change: '+23%', up: true, color: 'text-gold', bg: 'bg-gold-100' },
          { icon: DollarSign, label: 'Revenue', value: formatCurrency(stats.revenue), change: '+18%', up: true, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
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
                <span className="text-[10px] text-muted">{rev >= 1000 ? `$${(rev / 1000).toFixed(1)}k` : `$${Math.floor(rev)}`}</span>
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
            <button onClick={onReviewGuides} className="btn-gold text-sm !py-2">
              Review
            </button>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
