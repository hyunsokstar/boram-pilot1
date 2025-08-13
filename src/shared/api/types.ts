// 공통 API 응답 타입
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// 로그인 요청 타입
export interface LoginRequest {
    username: string;
    password: string;
}

// 로그인 응답 데이터 타입
export interface LoginResponseData {
    username: string;
    message: string;
    token: string;
    tokenType: string;
}

// 회원가입 요청 타입
export interface SignupRequest {
    username: string;
    password: string;
}

// 회원가입 응답 데이터 타입
export interface SignupResponseData {
    message: string;
}

// 사용자 정보 타입
export interface UserInfo {
    id: number;
    username: string;
    name: string;
    department: string;
    role: string;
}

// 로컬 저장용 사용자 타입
export interface User {
    id: string;
    name: string;
    email?: string;
    department: string;
    role: string;
    token: string;
    permissions?: string[];
}
