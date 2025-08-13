import { useState } from 'react';
import { loginApi, saveAuthToken, saveUserInfo, LoginRequest, User } from '@/shared/api';
import { useAuthStore } from '@/shared/store';

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const { login: setAuthState, setLoading, isLoading } = useAuthStore();

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginApi(credentials);

            if (response.success && response.data) {
                // 토큰 저장
                saveAuthToken(response.data.token);

                // 사용자 정보 변환 및 저장
                const user: User = {
                    id: response.data.username,
                    name: response.data.username,
                    department: '고객상담팀', // 추후 백엔드에서 받아올 예정
                    role: '상담원', // 추후 백엔드에서 받아올 예정
                    token: response.data.token
                };

                saveUserInfo(user);
                
                // Zustand 스토어에 인증 정보 저장
                setAuthState(user, response.data.token);

                console.log('로그인 성공:', response.message);
                return { success: true, user };
            } else {
                throw new Error(response.message || '로그인에 실패했습니다.');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || '로그인 중 오류가 발생했습니다.';
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
