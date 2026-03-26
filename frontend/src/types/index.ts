// Types for the User entity and authentication

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserFormData {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthContextType {
  token: string | null;
  username: string | null;
  role: 'USER' | 'ADMIN' | null;
  login: (token: string, username: string, role: 'USER' | 'ADMIN') => void;
  logout: () => void;
  isAuthenticated: boolean;
}
