import { Users, Globe, Calendar, DollarSign, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import { formatCurrency, formatCurrencyCompact } from '../../utils/formatters';

// A null change means there was no baseline to measure against this month, so
// no badge is shown. Rendering "+0%" or an invented figure there would be a
// claim the data does not support.
function ChangeBadge({ change }) {
  if (change === null || change === undefined) {
    return <span className="text-[10px] text-muted-dark">no prior data</span>;
  }

  const up = change > 0;
  const flat = change === 0;
  const tone = flat ? 'text-muted' : up ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${tone}`}>
      {!flat && (up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
      {flat ? 'no change' : `${up ? '+' : ''}${change.toFixed(change % 1 === 0 ? 0 : 1)}%`}
    </div>
  );
}

export default function OverviewTab({ stats, growth = {}, maxRevenue, months, onReviewGuides }) {
  return (
    <div>
      <ScrollReveal>
        <h1 className="font-heading text-3xl font-bold text-cream mb-8">Dashboard Overview</h1>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: growth.users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Globe, label: 'Active Guides', value: stats.totalGuides, change: growth.guides, color: 'text-green-400', bg: 'bg-green-500/10' },
          { icon: Calendar, label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), change: growth.bookings, color: 'text-gold', bg: 'bg-gold-100' },
          { icon: DollarSign, label: 'Revenue', value: formatCurrency(stats.revenue), change: growth.revenue, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 60}>
            <div className="card-dark p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <ChangeBadge change={stat.change} />
              </div>
              <div className="text-2xl font-heading font-bold text-cream">{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <p className="text-[11px] text-muted-dark mb-8 -mt-4">
        Percentages compare each total against where it stood at the start of this month.
      </p>

      {/* Revenue Chart */}
      <ScrollReveal delay={240}>
        <div className="card-dark p-6">
          <h3 className="font-heading text-xl font-bold text-cream mb-6">Monthly Revenue</h3>
          <div className="flex items-end gap-2 h-48">
            {stats.monthlyRevenue.map((rev, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-muted">{formatCurrencyCompact(rev)}</span>
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
