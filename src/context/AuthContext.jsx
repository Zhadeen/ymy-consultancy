import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as authService from '../application/services/authService';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

const AuthContext = createContext(null);

// How long an admin can sit idle before being signed out. Admins hold
// destructive powers (wipe, disable accounts), so an unattended admin session
// left open — e.g. overnight — is a real risk. Regular visitors and guides keep
// the normal persistent session, which is the expected behaviour for a booking
// site. Change this one value to adjust the window.
const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuide, setIsGuide] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Signing a disabled account out re-fires this listener with a null user,
  // whose branch clears authError. This flag tells that pass to keep the
  // message so the person actually sees why they were turned away.
  const keepAuthErrorRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const appUser = await authService.resolveAppUser(firebaseUser);

          // An admin has disabled this account. Sign it straight back out rather
          // than letting it into the app, and say why so the person is not left
          // guessing at a login that appears to do nothing.
          if (appUser.disabled) {
            keepAuthErrorRef.current = true;
            await authService.logout();
            setUser(null);
            setIsGuide(false);
            setIsAdmin(false);
            setAuthError('This account has been disabled. Please contact support if you think this is a mistake.');
            return;
          }

          setUser(appUser);
          setIsGuide(appUser.role === 'guide');
          setIsAdmin(appUser.role === 'admin');
          setAuthError(null);
        } else {
          setUser(null);
          setIsGuide(false);
          setIsAdmin(false);
          if (keepAuthErrorRef.current) {
            keepAuthErrorRef.current = false; // consume it, keep the message on screen
          } else {
            setAuthError(null);
          }
        }
      } catch (err) {
        // Sign-in succeeded but the profile lookup failed (e.g. Firestore rules
        // denied the read). Surface it instead of leaving the UI silently stuck.
        console.error("Auth initialization error:", err);
        setAuthError(err.message || 'Could not load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Auto sign-out an idle admin. Setting the message before logout and flagging
  // keepAuthErrorRef means the null-user pass below preserves it, so the admin
  // lands on the sign-in page understanding why, rather than silently logged out.
  useIdleTimeout(user?.role === 'admin', ADMIN_IDLE_TIMEOUT_MS, async () => {
    keepAuthErrorRef.current = true;
    setAuthError('You were signed out after 30 minutes of inactivity. Please sign in again.');
    await authService.logout();
  });

  const login = async (email, password) => {
    return authService.login(email, password);
  };

  const loginWithGoogle = async () => {
    return authService.loginWithGoogle();
  };

  const register = async (name, email, password, role = 'visitor') => {
    return authService.register(name, email, password, role);
  };

  const resetPassword = async (email) => {
    return authService.resetPassword(email);
  };

  const reauthenticate = async (password) => {
    return authService.reauthenticate(password);
  };

  const logout = async () => {
    return authService.logout();
  };

  const updateUserLocal = (newData) => {
    setUser(newData);
  };

  return (
    <AuthContext.Provider value={{ user, isGuide, isAdmin, loading, authError, login, loginWithGoogle, register, logout, resetPassword, reauthenticate, updateUserLocal }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
