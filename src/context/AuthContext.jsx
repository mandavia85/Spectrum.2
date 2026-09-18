import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Keep session alive on user activity; enforce timeout otherwise.
    const activityHandler = () => {
      if (authService.getSession()) {
        authService.touchSession();
      }
    };
    window.addEventListener('click', activityHandler);
    window.addEventListener('keydown', activityHandler);

    const interval = setInterval(() => {
      const session = authService.getSession();
      if (!session && user) {
        setUser(null);
      }
    }, 15000);

    return () => {
      window.removeEventListener('click', activityHandler);
      window.removeEventListener('keydown', activityHandler);
      clearInterval(interval);
    };
  }, [user]);

  const login = useCallback(async (username, password, rememberMe) => {
    setLoading(true);
    const result = await authService.login(username, password, rememberMe);
    setLoading(false);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
