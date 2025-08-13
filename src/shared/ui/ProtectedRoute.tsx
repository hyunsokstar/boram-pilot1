"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/shared/store";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'
    const { isAuthenticated } = useAuthStore(); // legacy auth (Zustand)

    useEffect(() => {
        // 만약 NextAuth는 비인증 상태이고, Zustand도 비인증이면 로그인 페이지로 이동
        if (status === "unauthenticated" && !isAuthenticated) {
            router.push("/");
        }
    }, [status, isAuthenticated, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    // NextAuth가 인증되었거나(소셜 로그인),
    // 또는 기존 로컬 로그인(Zustand)이 true인 경우 접근 허용
    if (status === "authenticated" || isAuthenticated) {
        return <>{children}</>;
    }

    // 리다이렉트 진행 중에는 비어있는 화면 방지 위해 간단한 플레이스홀더 반환
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <p className="text-gray-500">이동 중...</p>
        </div>
    );
}
