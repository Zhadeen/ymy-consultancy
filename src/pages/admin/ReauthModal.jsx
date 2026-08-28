import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Password re-verification gate for destructive admin actions. The admin must
// re-enter their password immediately before the action runs, so a hijacked or
// left-open admin session can't wipe data or disable accounts on its own.
//
// The parent mounts this only while the gate is open ({open && <ReauthModal/>}),
// so state starts fresh on each open without a reset effect.
export default function ReauthModal({ actionLabel, onCancel, onConfirmed }) {
  const { reauthenticate } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Enter your password to confirm.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await reauthenticate(password);
      onConfirmed();
    } catch (err) {
      // auth/wrong-password and auth/invalid-credential both mean "bad password"
      const wrong = err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential';
      setError(wrong ? 'Incorrect password. Please try again.' : (err?.message || 'Could not confirm your identity.'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[120]" onClick={onCancel}>
      <div className="card-dark p-6 sm:p-8 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onCancel} className="absolute top-4 right-4 text-muted hover:text-cream transition-colors">
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
          <ShieldAlert size={24} className="text-red-400" />
        </div>

        <h2 className="font-heading text-xl font-bold text-cream mb-1">Confirm it's you</h2>
        <p className="text-muted text-sm mb-5">
          For security, re-enter your password to {actionLabel || 'run this action'}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your admin password"
            className="input-dark w-full"
            autoComplete="current-password"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-gold flex-1 disabled:opacity-50">
              {loading ? 'Verifying…' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
