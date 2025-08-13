"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();

    useEffect(() => {
        // 앱 시작시 인증 정보 초기화
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    // 로딩 중일 때 스피너 표시
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    // 인증되지 않은 경우 빈 화면 (리다이렉트 처리 중)
    if (!isAuthenticated) {
        return null;
    }

    // 인증된 경우에만 children 렌더링
    return <>{children}</>;
}
