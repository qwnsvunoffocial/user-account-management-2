import api from './api';
import { User, UpdateUserPayload } from '../types/User';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/api/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: UpdateUserPayload): Promise<User> => {
  const response = await api.put<User>(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};
