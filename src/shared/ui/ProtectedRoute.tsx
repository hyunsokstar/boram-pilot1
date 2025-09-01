"use client";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    // 백엔드 연동 제거로 인해 모든 페이지 접근 허용
    return <>{children}</>;
}
