export interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
