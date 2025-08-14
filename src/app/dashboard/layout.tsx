"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { TabBar } from "@/widgets/dashboard-tab-bar";
import { useTabStore } from "@/widgets/dashboard-tab-bar/model/tabStore";
import { ProtectedRoute } from "@/shared/ui";
import { headerMenus, NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { findTopByPath } from "@/shared/config/common-nav-menus";
import { useNavStore } from "@/shared/store/navStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);

    // Zustand 탭 스토어 사용
    const {
        activeTabId,
        removeTab,
        setActiveTab,
        getSortedTabs
    } = useTabStore();

    // 정렬된 탭 배열 가져오기
    const tabs = getSortedTabs();

    // 현재 활성 탭 계산 (헤더와 동일한 로직)
    const activeTopNo = useMemo(
        () => (pathname ? findTopByPath(pathname)?.menuNo ?? null : null),
        [pathname]
    );

    // 탭 클릭 핸들러
    const handleTabChange = (tabId: string) => {
        const selectedTab = tabs.find(tab => tab.id === tabId);
        if (!selectedTab) return;

        setActiveTab(tabId);

        // 사이드바 필터링 설정 (헤더와 동일)
        setFilteredTop(selectedTab.menuNo || '');

        // 항상 사이드바 이벤트 발생 (메뉴 펼치기 용)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo: selectedTab.menuNo } }));
        }

        // href가 있으면 페이지 이동
        if (selectedTab.href && selectedTab.href.trim() !== "") {
            router.push(selectedTab.href);
        }
    };

    // 탭 닫기 핸들러
    const handleTabClose = (tabId: string) => {
        const tabs = getSortedTabs();
        const currentIndex = tabs.findIndex(tab => tab.id === tabId);
        const isActiveTab = activeTabId === tabId;

        console.log('탭 닫기:', tabId, '현재 인덱스:', currentIndex, '활성 탭인가:', isActiveTab);

        // 먼저 탭을 삭제
        removeTab(tabId);

        // 활성 탭이 삭제된 경우 페이지 이동 처리
        if (isActiveTab) {
            const remainingTabs = tabs.filter(tab => tab.id !== tabId);
            console.log('남은 탭들:', remainingTabs.map(t => t.label));

            if (remainingTabs.length > 0) {
                let targetTab;

                if (currentIndex > 0) {
                    // 이전 탭으로 이동
                    targetTab = remainingTabs[currentIndex - 1];
                    console.log('이전 탭으로 이동:', targetTab.label);
                } else {
                    // 다음 탭으로 이동 (첫 번째 탭이었던 경우)
                    targetTab = remainingTabs[0];
                    console.log('다음 탭으로 이동:', targetTab.label);
                }

                // 새로운 활성 탭 설정
                setActiveTab(targetTab.id);
                console.log('새 활성 탭 설정:', targetTab.id);

                // 새로운 활성 탭으로 페이지 이동
                if (targetTab?.href) {
                    setFilteredTop(targetTab.menuNo || '');
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo: targetTab.menuNo } }));
                    }
                    router.push(targetTab.href);
                }
            } else {
                // 모든 탭이 삭제된 경우
                setActiveTab(null);
            }
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
                                    tabs={tabs}
                                    activeTab={activeTopNo || undefined}
                                    onTabChange={handleTabChange}
                                    onTabClose={handleTabClose}
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
