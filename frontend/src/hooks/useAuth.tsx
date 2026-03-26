import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuthResponse } from '../types/Auth';
import * as authService from '../services/authService';

interface UserInfo {
  username: string;
  role: string;
  id?: number;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): UserInfo | null {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      return JSON.parse(stored) as UserInfo;
    }
  } catch {
    localStorage.removeItem('user');
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(
    // NOTE: localStorage is susceptible to XSS attacks. For production, consider httpOnly cookies.
    () => localStorage.getItem('token')
  );

  const login = useCallback((authResponse: AuthResponse) => {
    const userInfo: UserInfo = {
      username: authResponse.username,
      role: authResponse.role,
    };
    // NOTE: localStorage is susceptible to XSS attacks. For production, consider httpOnly cookies.
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setToken(authResponse.token);
    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
