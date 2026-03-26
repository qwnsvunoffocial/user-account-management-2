import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const [role, setRole] = useState<'USER' | 'ADMIN' | null>(
    () => (localStorage.getItem('role') as 'USER' | 'ADMIN' | null)
  );

  const login = useCallback((newToken: string, newUsername: string, newRole: 'USER' | 'ADMIN') => {
    // NOTE: Storing JWT in localStorage is convenient but may be vulnerable to XSS.
    // An alternative is to use httpOnly cookies, but that requires additional backend support.
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setUsername(newUsername);
    setRole(newRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken(null);
    setUsername(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({ token, username, role, login, logout, isAuthenticated: !!token }),
    [token, username, role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
