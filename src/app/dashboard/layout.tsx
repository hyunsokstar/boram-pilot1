"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { TabBar } from "@/widgets/dashboard-tab-bar";
import { ProtectedRoute } from "@/shared/ui";
import { headerMenus, NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { findTopByPath } from "@/shared/config/common-nav-menus";
import { useNavStore } from "@/shared/store/navStore";
import { useMemo } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);

    // 헤더 메뉴를 탭바용으로 변환
    const dashboardTabs = headerMenus.map(menu => ({
        id: menu.menuNo,
        label: menu.label,
        href: menu.href,
        menuNo: menu.menuNo
    }));

    // 현재 활성 탭 계산 (헤더와 동일한 로직)
    const activeTopNo = useMemo(
        () => (pathname ? findTopByPath(pathname)?.menuNo ?? null : null),
        [pathname]
    );

    // 탭 클릭 핸들러 (헤더와 동일한 로직)
    const handleTabChange = (tabId: string) => {
        const selectedTab = dashboardTabs.find(tab => tab.id === tabId);
        if (!selectedTab) return;

        // 사이드바 필터링 설정 (헤더와 동일)
        setFilteredTop(selectedTab.menuNo);

        // 항상 사이드바 이벤트 발생 (메뉴 펼치기 용)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo: selectedTab.menuNo } }));
        }

        // href가 있으면 페이지 이동
        if (selectedTab.href && selectedTab.href.trim() !== "") {
            router.push(selectedTab.href);
        }
    };

    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col">
                <DashboardHeader />
                <main className="flex-1 flex min-h-0">
                    <DashboardSidebar />
                    <div className="flex-1 bg-white flex flex-col">
                        <div className="border-b border-gray-200 bg-white">
                            <div className="px-6">
                                <TabBar
                                    tabs={dashboardTabs}
                                    activeTab={activeTopNo || undefined}
                                    onTabChange={handleTabChange}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
