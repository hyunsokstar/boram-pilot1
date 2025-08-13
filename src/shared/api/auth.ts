import { apiClient } from "./client";
import { ApiResponse, LoginRequest, LoginResponseData, SignupRequest, SignupResponseData } from "./types";

// 로그인 API
export const loginApi = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', credentials);
    return response.data;
};

// 회원가입 API
export const signupApi = async (userData: SignupRequest): Promise<ApiResponse<SignupResponseData>> => {
    const response = await apiClient.post<ApiResponse<SignupResponseData>>('/auth/signup', userData);
    return response.data;
};

// 토큰 저장
export const saveAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

// 토큰 가져오기
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// 사용자 정보 저장
export const saveUserInfo = (userInfo: any) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

// 사용자 정보 가져오기
export const getUserInfo = () => {
    if (typeof window !== 'undefined') {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
};

// 로그아웃
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
};
