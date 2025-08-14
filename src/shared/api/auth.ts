import { apiClient } from "./client";
import type { ApiResponse, LoginRequest, LoginResponseData } from "./types";

// 로그인 API: JSON 전송
export const loginApi = async (
    credentials: LoginRequest
): Promise<ApiResponse<LoginResponseData>> => {
    const endpoint = "/auth/login"; // prod에서 /backend/auth/login으로 프록시
    const { data } = await apiClient.post<ApiResponse<LoginResponseData>>(
        endpoint,
        { username: credentials.username, password: credentials.password },
        { headers: { "Content-Type": "application/json", Accept: "application/json" } }
    );
    return data;
};
