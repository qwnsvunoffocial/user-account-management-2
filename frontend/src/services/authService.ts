import api from './api';
import { AuthResponse, LoginFormData, RegisterFormData } from '../types';

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const register = async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};
