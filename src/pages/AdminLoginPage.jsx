import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import ScrollReveal from '../components/common/ScrollReveal';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { user, authError, login, logout, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Only admins continue into the panel. A signed-in non-admin is not redirected
  // or signed out automatically; they are shown the notice below instead, so an
  // ordinary visitor who lands here does not lose their session.
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError('');
    try {
      await login(email, password);
      // Redirect (admins) or the non-admin notice below is handled by state.
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  // Signed in, but this account has no admin access.
  if (user && user.role !== 'admin') {
    return (
      <main className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <ScrollReveal className="w-full max-w-md">
          <div className="card-dark p-8 text-center border-red-500/20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <Shield size={30} className="text-red-400" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-cream mb-3">No admin access</h1>
            <p className="text-muted text-sm mb-8 leading-relaxed">
              You are signed in as <span className="text-cream font-medium">{user.email}</span>,
              which is not an administrator account.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="btn-gold w-full !py-3">Go to my dashboard</Link>
              <button onClick={handleSignOut} className="btn-ghost w-full !py-3">
                Sign in as a different account
              </button>
            </div>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-16">
      <ScrollReveal className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src={logo} alt="YMY Consultancy Logo" className="h-14 w-auto object-contain drop-shadow-lg" />
          </Link>
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-5">
            <Shield size={14} className="text-gold" />
            <span className="text-gold text-xs font-bold uppercase tracking-widest">Admin Portal</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-cream mb-2">Administrator Sign In</h1>
          <p className="text-muted text-sm">Restricted access. Authorised personnel only.</p>
        </div>

        <div className="card-dark p-8 border-gold/20">
          {(error || authError) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-btn px-4 py-3 mb-5">
              <p className="text-red-400 text-sm">{error || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
              <input
                type="email"
                placeholder="Admin email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark !pl-10"
                id="admin-login-email"
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-dark !pl-10 !pr-12"
                id="admin-login-password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-dark hover:text-cream transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}
                className="text-sm text-gold hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-gold w-full !py-3.5 text-base" id="admin-login-submit-btn">
              Sign In to Admin Panel
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors text-sm">
            <ArrowLeft size={14} />
            Back to main site
          </Link>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative card-dark p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              {resetSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={28} className="text-green-400" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-cream mb-2">Reset Link Sent</h3>
                  <p className="text-muted text-sm mb-6">
                    Check the inbox at <span className="text-gold">{resetEmail}</span> for a password reset link.
                  </p>
                  <button
                    onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                    className="btn-gold w-full !py-3"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-xl font-bold text-cream mb-2">Reset Admin Password</h3>
                  <p className="text-muted text-sm mb-6">Enter the admin email and we'll send a reset link.</p>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
                      <input
                        type="email"
                        placeholder="Admin email address"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        className="input-dark !pl-10"
                        autoFocus
                      />
                    </div>
                    <button type="submit" className="btn-gold w-full !py-3">Send Reset Link</button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="btn-ghost w-full !py-3"
                    >
                      Cancel
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </ScrollReveal>
    </main>
  );
}
