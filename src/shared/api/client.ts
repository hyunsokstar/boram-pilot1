import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 환경별 API 서버 설정
const getApiBaseUrl = () => {
    // 개발 환경에서는 로컬 백엔드로 직접 호출
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 개발 환경 - 로컬 Spring Boot 서버 사용');
        return 'http://localhost:8080';
    }

    // 프로덕션에서는 동일 출처 경로를 통해 Next.js 리라이트 프록시로 연결
    // 기본값: '/backend' (next.config.mjs에서 BACKEND_URL로 프록시)
    const path = process.env.NEXT_PUBLIC_BACKEND_PATH || '/backend';
    console.log('🌐 프로덕션 환경 - Same-origin 프록시 사용', path);
    return path;
};

// API 베이스 설정
export const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
    },
    timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터 (토큰 자동 추가)
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // 401 에러 시 로그아웃 처리
        if (error.response?.status === 401) {
            console.log('인증 에러 - 로그아웃 필요');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);
