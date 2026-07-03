import { Trash2, Globe } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function SystemTab({ onWipeData }) {
  return (
    <div>
      <ScrollReveal>
        <h1 className="font-heading text-3xl font-bold text-cream mb-8">System Management</h1>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-dark p-8 border-red-500/20">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream mb-2">Wipe Mock Data</h3>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Clear all guides, applications, bookings, and reviews from the database.
              This is intended for transitioning from development to production.
              <br /><br />
              <strong className="text-red-400">WARNING: This action is permanent and cannot be reversed.</strong>
            </p>
            <button
              onClick={onWipeData}
              className="w-full py-4 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all duration-300"
            >
              Wipe Database Clean
            </button>
          </div>

          <div className="card-dark p-8 opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mb-6">
              <Globe size={24} className="text-gold" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream mb-2">Export Data (Coming Soon)</h3>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Download a full CSV export of all users and guides registered on the platform.
            </p>
            <button disabled className="w-full py-4 border border-dark-500 text-muted rounded-xl font-bold">
              Feature Locked
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
