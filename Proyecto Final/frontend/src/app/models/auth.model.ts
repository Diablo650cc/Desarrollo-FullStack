export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
}
