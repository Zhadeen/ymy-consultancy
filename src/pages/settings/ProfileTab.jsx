import { User, Mail, Save, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function ProfileTab({ user, name, setName, loading, onSubmit }) {
  return (
    <ScrollReveal>
      <div className="card-dark p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-dark !pl-11" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
              <div className="relative opacity-60 cursor-not-allowed">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                <input type="email" value={user?.email || ''} className="input-dark !pl-11" disabled />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle2 size={16} className={user?.emailVerified ? 'text-green-500' : 'text-yellow-500'} />
                </div>
              </div>
              <p className="text-[10px] text-muted-dark mt-2 italic px-1">
                {user?.emailVerified ? 'Email verified ✓' : 'Email not yet verified'}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 px-8">
              {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </ScrollReveal>
  );
}
