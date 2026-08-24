import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as authService from '../application/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuide, setIsGuide] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const appUser = await authService.resolveAppUser(firebaseUser);
          setUser(appUser);
          setIsGuide(appUser.role === 'guide');
          setIsAdmin(appUser.role === 'admin');
          setAuthError(null);
        } else {
          setUser(null);
          setIsGuide(false);
          setIsAdmin(false);
          setAuthError(null);
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

  const logout = async () => {
    return authService.logout();
  };

  const updateUserLocal = (newData) => {
    setUser(newData);
  };

  return (
    <AuthContext.Provider value={{ user, isGuide, isAdmin, loading, authError, login, loginWithGoogle, register, logout, resetPassword, updateUserLocal }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
