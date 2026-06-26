import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  email: string;
  user_metadata: { full_name: string };
};

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  mockLogin: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      mockLogin: (email) => set({ 
        user: { 
          id: 'mock-user-id', 
          email, 
          user_metadata: { full_name: email.split('@')[0] } 
        } 
      }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
