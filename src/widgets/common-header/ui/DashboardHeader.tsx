"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { headerMenus } from "@/shared/config/header-menus";
import { useAuthStore } from "@/shared/store";

export default function DashboardHeader() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();

    // 컴포넌트 마운트시 인증 정보 초기화
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const handleMenuClick = (menuId: string) => {
        router.push(`/dashboard/${menuId}`);
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        router.push('/');
    };

    const isActiveMenu = (menuId: string) => {
        return pathname === `/dashboard/${menuId}`;
    };

    return (
        <header className="w-full">
            {/* Top Header with Logo and User Info */}
            <div className="h-8 flex items-center justify-between px-4 text-white bg-slate-800">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                >
                    <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-sm">boram</span>
                </button>

                <div className="relative">
                    <button
                        type="button"
                        className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded text-xs"
                        onClick={() => setUserMenuOpen(prev => !prev)}
                    >
                        <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {isAuthenticated && user ? (
                            <span>{user.department} / {user.name}</span>
                        ) : (
                            <span>로그인 필요</span>
                        )}
                        <svg className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {userMenuOpen && (
                        <ul className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded border text-sm z-20 text-gray-700">
                            {isAuthenticated && user && (
                                <li className="px-3 py-2 border-b bg-gray-50 text-gray-500 text-xs">
                                    {user.role} • {user.name}
                                </li>
                            )}
                            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b">환경설정</li>
                            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b">비밀번호변경</li>
                            <li
                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-red-600"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Navigation Menu Bar */}
            <div className="bg-white border-b border-gray-200">
                <nav className="flex items-center px-4 h-16">
                    <div className="flex items-center gap-4 min-w-max overflow-x-auto">
                        {headerMenus.map((menu) => (
                            <button
                                key={menu.id}
                                type="button"
                                onClick={() => handleMenuClick(menu.id)}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors min-w-[60px] ${isActiveMenu(menu.id)
                                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d={menu.icon} clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium whitespace-nowrap">{menu.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    );
}
