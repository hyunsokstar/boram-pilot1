import { apiClient } from "./client";
import { ApiResponse, LoginRequest, LoginResponseData, SignupRequest, SignupResponseData, User } from "./types";

// 로그인 API
export const loginApi = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
  const endpoint = "/auth/login"; // prod: /backend/auth/login 로 프록시됨

  const form = new URLSearchParams();
  form.set("username", credentials.username);
  form.set("password", credentials.password);

  const res = await apiClient.post<ApiResponse<LoginResponseData>>(
    endpoint,
    form.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      transformRequest: [(d) => d], // axios의 JSON 변환 방지
    }
  );
  return res.data;
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
export const saveUserInfo = (userInfo: User) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

// 사용자 정보 가져오기
export const getUserInfo = (): User | null => {
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
