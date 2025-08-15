"use client";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { headerMenus, NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { resolveViewByHref } from "@/widgets/dashboard-views/registry";
import { findTopByPath } from "@/shared/config/common-nav-menus";
import { useNavStore } from "@/shared/store/navStore";
import { useAuthStore } from "@/shared/store/authStore";
import { useTabStore } from "@/widgets/dashboard-tab-bar/model/tabStore";
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
    const pathname = usePathname();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);
    const { user, logout } = useAuthStore();
    const { addTab, tabs, getAllActiveTabIds } = useTabStore();

    // 현재 경로 기반 활성 메뉴
    const currentActiveMenuNo = pathname ? findTopByPath(pathname)?.menuNo ?? null : null;

    // Zustand에서 직접 활성 탭 ID들을 가져와서 메뉴 번호로 변환
    const allActiveTabIds = getAllActiveTabIds().filter(id => id !== null);
    const allActiveMenuNos = allActiveTabIds
        .map(tabId => tabs.find(tab => tab.id === tabId))
        .filter(tab => tab && tab.menuNo)
        .map(tab => tab!.menuNo);

    console.log('Header 활성 탭 계산:', {
        currentActiveMenuNo,
        allActiveTabIds,
        allActiveMenuNos,
        tabsCount: tabs.length,
        allTabs: tabs.map(t => ({ id: t.id, label: t.label, menuNo: t.menuNo }))
    });

    const onHeaderClick = (menuNo: string, href: string) => {
        // 사이드바 필터링 설정
        setFilteredTop(menuNo);

        // 항상 사이드바 이벤트 발생 (메뉴 펼치기 용)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo } }));
        }

        // 탭 추가 (Zustand 스토어 사용)
        const headerMenu = headerMenus.find(menu => menu.menuNo === menuNo);
        if (headerMenu) {
            const View = resolveViewByHref(headerMenu.href || undefined) || undefined;
            addTab({
                id: headerMenu.menuNo,
                label: headerMenu.label,
                href: headerMenu.href,
                menuNo: headerMenu.menuNo,
                isClosable: true,
                // 스플릿 렌더링 단순화를 위해 뷰를 탭에 포함
                view: View
            });
        }

        // href가 있으면 페이지 이동
        if (href && href.trim() !== "") {
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
                        // 현재 활성 메뉴이거나, 다른 영역에서 활성화된 탭이 있는지 확인
                        const isCurrentActive = currentActiveMenuNo === m.menuNo;
                        const hasActiveTabInOtherArea = allActiveMenuNos.includes(m.menuNo);
                        const isActive = isCurrentActive || hasActiveTabInOtherArea;

                        // 디버깅용 로그
                        if (isActive) {
                            console.log(`Menu ${m.menuNo} is active:`, {
                                isCurrentActive,
                                hasActiveTabInOtherArea,
                                currentActiveMenuNo,
                                allActiveMenuNos
                            });
                        }
                        return (
                            <button
                                key={m.menuNo}
                                onClick={() => onHeaderClick(m.menuNo, m.href)}
                                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-[120px] ${isActive
                                    ? "bg-blue-50 text-blue-700 border-2 border-dashed border-blue-300"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95 border-2 border-transparent"
                                    }`}
                                title={m.label}
                            >
                                {/* 아이콘 컨테이너 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${isActive
                                    ? "bg-blue-100"
                                    : "bg-gray-100 group-hover:bg-gray-200"
                                    }`}>
                                    {m.iconUrl ? (
                                        <Image
                                            src={m.iconUrl}
                                            alt={`${m.label} 아이콘`}
                                            width={18}
                                            height={18}
                                            className={`transition-opacity ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`}
                                        />
                                    ) : (
                                        <div className={`w-4 h-4 rounded-sm ${isActive ? "bg-blue-400" : "bg-gray-400"}`} />
                                    )}
                                </div>

                                {/* 텍스트 */}
                                <span className="font-medium">{m.label}</span>

                                {/* 호버 효과 */}
                                <div className={`absolute inset-0 rounded-lg transition-opacity ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-5 group-hover:bg-gray-900"
                                    }`} />
                            </button>
                        );
                    })}
                </div>

                {/* 사용자 정보 영역 */}
                <div className="flex items-center gap-3">
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
