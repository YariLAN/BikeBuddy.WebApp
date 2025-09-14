import { ApiResponse, apiService } from '@/core/services/ApiService';
import JwtService from '@/core/services/JwtService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'


interface IActionState {
  login: (login: string, password: string) => void;
  logout: () => void;
  register: (email: string, username: string, password: string) => void;
  verify: (userId : string | null, token: string | null) => void
}

interface IInitialState {
  isAuthenticated: boolean,
  isVerified: boolean,
  isLoading: boolean
  error: string
}

interface AuthState extends IInitialState, IActionState {}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      isVerified: false,
      isLoading: false,
      error: '',
      login: async (login, password) => {
        try {
          const response = await apiService.post<AuthResponse>('/auth/login', { login, password }, true); 
          console.log('Login: ', response.data)
          
          JwtService.saveToken(response.data!.accessToken);
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
      },

      verify: async (userId, token) => {     

        if (!userId || !token) {
          set({ error: "Неверная ссылка"});
          return Promise.reject("Неверная ссылка")
        }

        set({ isLoading: true, isVerified: false, error: '' })

        try {
          const result = await apiService.get<boolean>(`/auth/verify?userId=${userId}&token=${token}`);

          if (result.error) {
            set({ error: result.error })
          }
          else if (result.data) {
            set({ isVerified: result.data })
          }
          
        } catch (err: any) {
          throw new Error(err.message)
        } finally {
          set({ isLoading: false })
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

export const useEmailVerify = (userId: string | null, token: string | null) => useAuthStore.getState().verify(userId, token);
export const useIsLoading = () => useAuthStore(state => state.isLoading);
export const useShowError = () => useAuthStore(state => state.error);

