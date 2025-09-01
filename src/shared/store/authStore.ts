import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../api/types';

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
        (set) => ({
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

            // 앱 시작시 로그인 상태로 초기화 (백엔드 연동 없음)
            initializeAuth: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
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
