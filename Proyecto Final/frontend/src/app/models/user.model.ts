export interface UserRecord {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}
