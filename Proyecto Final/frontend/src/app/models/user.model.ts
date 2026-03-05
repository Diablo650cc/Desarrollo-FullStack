export interface UserRecord {
  id: string;
  email: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
}
