export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
}
