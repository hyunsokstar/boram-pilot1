"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { headerMenus, NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { resolveViewByHref } from "@/widgets/dashboard-views";
import { useNavStore } from "@/shared/store/navStore";
import { useAuthStore } from "@/shared/store/authStore";
import { useTabStore } from "@/widgets/dashboard-tab-bar/model/tabStore";
import { SplitModeSelect } from "@/widgets/dashboard-tab-bar/ui/split-mode-select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export default function DashboardHeader() {
    const router = useRouter();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);
    const { user, logout } = useAuthStore();
    const { splitMode, setSplitMode, activeHeaderCategories, addTab, updateHeaderCategories } = useTabStore();

    // 실시간으로 헤더 카테고리 상태를 감지하기 위한 구독
    React.useEffect(() => {
        // 스토어 상태 변화 감지를 위한 구독만 설정 (updateHeaderCategories 직접 호출 제거)
        const unsubscribe = useTabStore.subscribe(() => {
            // 상태 변화가 있을 때마다 헤더 카테고리 업데이트
            console.log('탭 상태 변화 감지, 헤더 카테고리 업데이트');
            updateHeaderCategories();
        });

        return unsubscribe;
    }, [updateHeaderCategories]); // updateHeaderCategories를 의존성에 추가

    const onHeaderClick = (menuNo: string, href: string) => {
        // 사이드바 필터링 설정
        setFilteredTop(menuNo);

        // 항상 사이드바 이벤트 발생 (메뉴 펼치기 용)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo } }));
        }

        // href가 있으면 (직접 페이지인 경우) 탭 등록 후 페이지 이동
        if (href && href.trim() !== "") {
            const headerMenu = headerMenus.find(menu => menu.menuNo === menuNo);
            if (headerMenu) {
                const View = resolveViewByHref(headerMenu.href || undefined) || undefined;
                addTab({
                    id: headerMenu.menuNo,
                    label: headerMenu.label,
                    href: headerMenu.href,
                    menuNo: headerMenu.menuNo,
                    isClosable: true,
                    view: View
                });
            }
            router.push(href);
        }
    };

    const handleLogout = async () => {
        try {
            // NextAuth 세션 종료
            await signOut({ redirect: false });

            // Zustand 상태 초기화
            logout();

            // 로그인 페이지로 이동
            router.push('/');
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
            // 오류가 발생해도 로컬 상태는 초기화하고 로그인 페이지로 이동
            logout();
            router.push('/');
        }
    };

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-200">
            <nav className="flex items-center justify-between px-6 py-3">
                {/* 로고/브랜드 영역 */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Boram</span>
                    </button>
                </div>

                {/* 메뉴 영역 */}
                <div className="flex items-center gap-1">
                    {headerMenus.map((m) => {
                        // 탭 스토어에서 활성 헤더 카테고리인지 확인
                        const isActiveCategory = activeHeaderCategories.has(m.menuNo);

                        // 디버깅용 로그
                        if (isActiveCategory) {
                            console.log(`헤더 메뉴 활성화: ${m.label}`, {
                                menuNo: m.menuNo,
                                isActiveCategory,
                                activeHeaderCategories: Array.from(activeHeaderCategories)
                            });
                        }
                        return (
                            <button
                                key={m.menuNo}
                                onClick={() => onHeaderClick(m.menuNo, m.href)}
                                className={`group relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-200 min-w-[80px] ${isActiveCategory
                                    ? "bg-blue-50 text-blue-700 border-2 border-dashed border-blue-300"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95 border-2 border-transparent"
                                    }`}
                                title={m.label}
                            >
                                {/* 아이콘 컨테이너 */}
                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isActiveCategory
                                    ? "bg-blue-100"
                                    : "bg-gray-100 group-hover:bg-gray-200"
                                    }`}>
                                    {m.iconUrl ? (
                                        <Image
                                            src={m.iconUrl}
                                            alt={`${m.label} 아이콘`}
                                            width={20}
                                            height={20}
                                            className={`transition-opacity ${isActiveCategory ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`}
                                        />
                                    ) : (
                                        <div className={`w-5 h-5 rounded-sm ${isActiveCategory ? "bg-blue-400" : "bg-gray-400"}`} />
                                    )}

                                    {/* 활성 상태 표시 점 */}
                                    {isActiveCategory && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                                    )}
                                </div>

                                {/* 텍스트 */}
                                <span className="font-medium text-center leading-tight">{m.label}</span>

                                {/* 호버 효과 */}
                                <div className={`absolute inset-0 rounded-xl transition-opacity ${isActiveCategory ? "opacity-0" : "opacity-0 group-hover:opacity-5 group-hover:bg-gray-900"
                                    }`} />
                            </button>
                        );
                    })}
                </div>

                {/* 사용자 정보 영역 */}
                <div className="flex items-center gap-3">
                    {/* 분할 모드 컨트롤 */}
                    <div className="flex items-center">
                        <SplitModeSelect
                            currentMode={splitMode}
                            onModeChange={setSplitMode}
                            size="compact"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <span className="text-white font-semibold text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="px-2 py-1.5">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.name || '사용자'}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                개인정보
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                설정
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                도움말
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                로그아웃
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}
