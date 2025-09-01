import { useState } from 'react';
import { LoginRequest, User } from '@/shared/api';
import { useAuthStore } from '@/shared/store';

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const { login: setAuthState, setLoading, isLoading } = useAuthStore();

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);

        try {
            // 짧은 딜레이로 로딩 애니메이션 보여주기
            await new Promise(resolve => setTimeout(resolve, 500));

            // 항상 성공하도록 수정 - 더이상 백엔드 호출 없음
            const user: User = {
                id: credentials.username,
                name: credentials.username,
                department: '관리자',
                role: '관리자',
                token: 'dummy-token'
            };

            // Zustand 스토어에 인증 정보 저장
            setAuthState(user, 'dummy-token');

            console.log('로그인 성공 (프론트엔드 전용)');
            return { success: true, user };
        } catch (err: unknown) {
            const errorMessage = '로그인 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('로그인 실패:', errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
        clearError: () => setError(null)
    };
};
