import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../api/types';
import { getAuthToken, getUserInfo, logout as apiLogout } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => 
        set({ user, isAuthenticated: true }),

      setToken: (token: string) => 
        set({ token }),

      login: (user: User, token: string) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        }),

      logout: () => {
        // API 로그아웃 (localStorage 클리어)
        apiLogout();
        
        // Zustand 상태 초기화
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => 
        set({ isLoading: loading }),

      // 앱 시작시 localStorage에서 인증 정보 복원
      initializeAuth: () => {
        const token = getAuthToken();
        const user = getUserInfo();
        
        if (token && user) {
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
