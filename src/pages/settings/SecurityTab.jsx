import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function SecurityTab({
  currentPassword, setCurrentPassword,
  newPassword, setNewPassword,
  confirmNewPassword, setConfirmNewPassword,
  showPasswords, setShowPasswords,
  loading, onSubmit
}) {
  return (
    <ScrollReveal>
      <div className="card-dark p-6 sm:p-8">
        <h2 className="font-heading text-xl font-bold text-cream mb-6 flex items-center gap-2">
          <Shield size={20} className="text-gold" /> Password & Security
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-dark !pl-11 !pr-12"
                placeholder="Enter current password"
                required
              />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-dark hover:text-cream">
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-dark !pl-11"
                placeholder="Enter new password (6+ characters)"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="input-dark !pl-11"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 px-8">
              {loading ? 'Updating...' : <><Shield size={18} /> Update Password</>}
            </button>
          </div>
        </form>
      </div>
    </ScrollReveal>
  );
}
