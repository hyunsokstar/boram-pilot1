import { apiClient } from "./client";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  SignupRequest,
  SignupResponseData,
  User,
} from "./types";

// 로그인 API: JSON 전송
export const loginApi = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponseData>> => {
  const endpoint = "/auth/login"; // prod: /backend/auth/login 로 프록시
  const { data } = await apiClient.post<ApiResponse<LoginResponseData>>(
    endpoint,
    { username: credentials.username, password: credentials.password },
    { headers: { "Content-Type": "application/json", Accept: "application/json" } }
  );
  return data;
};

// 회원가입(필요 시)
export const signupApi = async (
  userData: SignupRequest
): Promise<ApiResponse<SignupResponseData>> => {
  const { data } = await apiClient.post<ApiResponse<SignupResponseData>>(
    "/auth/signup",
    userData
  );
  return data;
};

// 로컬 스토리지 유틸
export const saveAuthToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem("authToken", token);
};
export const getAuthToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

export const saveUserInfo = (user: User) => {
  if (typeof window !== "undefined")
    localStorage.setItem("userInfo", JSON.stringify(user));
};
export const getUserInfo = (): User | null =>
  typeof window !== "undefined"
    ? (JSON.parse(localStorage.getItem("userInfo") as string) as User)
    : null;
export const clearUserInfo = () => {
  if (typeof window !== "undefined") localStorage.removeItem("userInfo");
};
