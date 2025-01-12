import { apiService } from '@/core/services/ApiService';
import JwtService from '@/core/services/JwtService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean;
  login: (login: string, password: string) => void;
  logout: () => void;
  register: (email: string, username: string, password: string) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      login: async (login, password) => {
        try {
          const response = await apiService.post<AuthResponse>('/auth/login', { login, password }, true); 
          console.log('Login: ', response.data)

          JwtService.saveToken(response.data.accessToken);
          set({ isAuthenticated: true})
        } catch (err: any) {
          throw new Error(err.message)
        }
      },
      logout: async () => {
        try {
          const response = await apiService.post<boolean>('/auth/logout', {}, true);
          console.log("Logout: ", response.data)

          if (response.data) {
            JwtService.destroyToken()
            set({ isAuthenticated: false });
          }
        } catch (err: any) {
          throw new Error(err.message)
        }
      },
      register: async (email, username, password) => {
        try {
          const response = await apiService.post<AuthResponse>('/auth/register', { email, username, password }, true);
          console.log("Register: ", response.data)
        } catch (err: any) {
          throw new Error(err.message)
        }
      }
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

