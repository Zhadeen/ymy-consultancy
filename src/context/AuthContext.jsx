import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuide, setIsGuide] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (email, password) => {
    if (email === 'admin@ymy.com') {
      setUser({ name: 'Admin', email, avatar: null });
      setIsAdmin(true);
      return true;
    }
    if (email === 'guide@ymy.com') {
      setUser({ name: 'Antoine Moreau', email, avatar: null });
      setIsGuide(true);
      return true;
    }
    setUser({ name: 'Laura Stevens', email, avatar: null });
    return true;
  };

  const register = (name, email) => {
    setUser({ name, email, avatar: null });
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsGuide(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isGuide, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
