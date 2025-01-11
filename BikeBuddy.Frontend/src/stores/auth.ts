import { apiService } from '@/core/services/ApiService';
import JwtService from '@/core/services/JwtService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true}),
      logout: async () => {
        try {
          const response = await apiService.post<boolean>('/auth/logout', {}, true);
          console.log("Logout: ", response.data)

          if (response.data) {
            JwtService.destroyToken()
            set({ isAuthenticated: false });
          }
        } catch (err) {
          console.log(err)
        }
      },
    }),
    {
      name: "auth-storage"
    }
  ));

export default useAuthStore;

export interface AuthResponse {
  accessToken: string,
  expiresAt: Date
}

export type LoginRequest = {
    login: string;
    password: string;
}

