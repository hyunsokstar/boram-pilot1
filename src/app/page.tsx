"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth";
import { useAuthStore } from "@/shared/store";
import { useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();
  const { status } = useSession();

  useEffect(() => {
    // 앱 시작시 인증 정보 초기화
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Zustand 또는 NextAuth 중 하나라도 인증되면 대시보드로 이동
    if ((!isLoading && isAuthenticated) || status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, status, router]);

  // 로딩 중일 때 표시
  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우에만 로그인 폼 표시
  if (!isAuthenticated && status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(99,179,237,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        </div>

        {/* 플로팅 요소들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4">
          <LoginForm />

          {/* 개선된 푸터 */}
          <footer className="mt-16 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                </svg>
              </div>
              <span className="font-medium">boram-pilot2</span>
            </div>
            <p className="text-xs text-gray-400">
              © 2025 WITHTEC All rights reserved. v0.1.0
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">이용약관</a>
              <a href="#" className="hover:text-gray-600 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-gray-600 transition-colors">고객지원</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return null; // 리다이렉트 중
}
