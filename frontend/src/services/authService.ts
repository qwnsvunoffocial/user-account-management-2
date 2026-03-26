import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/Auth';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await api.post('/api/auth/register', data);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
