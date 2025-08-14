"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { TabGroup, DropZoneOverlay } from "@/widgets/dashboard-tab-bar";
import type { TabAreas, SplitMode, DropPosition, TabArea } from "@/widgets/dashboard-tab-bar";
import { useTabStore } from "@/widgets/dashboard-tab-bar/model/tabStore";
import { ProtectedRoute } from "@/shared/ui";
import { NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { findTopByPath } from "@/shared/config/common-nav-menus";
import { useNavStore } from "@/shared/store/navStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);

    // TabGroup 상태 관리
    const [splitMode, setSplitMode] = useState<SplitMode>('single');
    const [tabAreas, setTabAreas] = useState<TabAreas>({
        left: [],
        center: [],
        right: []
    });
    const [isDragActive, setIsDragActive] = useState(false);
    const [activeDropZone, setActiveDropZone] = useState<DropPosition | null>(null);

    // Zustand 탭 스토어 사용
    const {
        activeTabId,
        removeTab,
        setActiveTab,
        getSortedTabs,
        reorderTabs
    } = useTabStore();

    // 정렬된 탭 배열 가져오기
    const tabs = getSortedTabs();

    // 탭을 영역별로 분배
    const currentTabAreas = useMemo<TabAreas>(() => {
        if (tabAreas.left.length === 0 && tabAreas.center.length === 0 && tabAreas.right.length === 0) {
            // 초기 상태: 모든 탭을 left 영역에 배치
            return {
                left: tabs,
                center: [],
                right: []
            };
        }
        return tabAreas;
    }, [tabs, tabAreas]);

    // 현재 활성 탭 계산
    const activeTopNo = useMemo(
        () => (pathname ? findTopByPath(pathname)?.menuNo ?? null : null),
        [pathname]
    );

    // 탭 클릭 핸들러
    const handleTabChange = (tabId: string, area: TabArea) => {
        const allTabs = [...currentTabAreas.left, ...currentTabAreas.center, ...currentTabAreas.right];
        const selectedTab = allTabs.find(tab => tab.id === tabId);
        if (!selectedTab) return;

        setActiveTab(tabId);
        setFilteredTop(selectedTab.menuNo || '');

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo: selectedTab.menuNo } }));
        }

        if (selectedTab.href && selectedTab.href.trim() !== "") {
            router.push(selectedTab.href);
        }
    };

    // 탭 순서 변경 핸들러
    const handleTabReorder = (sourceIndex: number, destinationIndex: number, area: TabArea) => {
        if (area === 'left' && currentTabAreas.left.length === tabs.length) {
            // 초기 상태에서는 기존 스토어 사용
            reorderTabs(sourceIndex, destinationIndex);
        } else {
            // 분할된 상태에서는 영역별 관리
            setTabAreas(prev => {
                const newAreas = { ...prev };
                const areaItems = [...newAreas[area]];
                const [removed] = areaItems.splice(sourceIndex, 1);
                areaItems.splice(destinationIndex, 0, removed);
                newAreas[area] = areaItems;
                return newAreas;
            });
        }
    };

    // 탭을 다른 영역으로 이동
    const handleTabMove = (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => {
        setTabAreas(prev => {
            const newAreas = { ...prev };

            // 원본 영역에서 탭 제거
            const movingTab = newAreas[fromArea].find(tab => tab.id === tabId);
            if (!movingTab) return prev;

            newAreas[fromArea] = newAreas[fromArea].filter(tab => tab.id !== tabId);

            // 목표 영역에 탭 추가
            if (targetIndex !== undefined) {
                newAreas[toArea].splice(targetIndex, 0, movingTab);
            } else {
                newAreas[toArea].push(movingTab);
            }

            return newAreas;
        });
    };

    // 드롭존에 탭 드롭 핸들러
    const handleDropZoneDrop = (tabId: string, position: DropPosition) => {
        console.log('드롭존 드롭:', { tabId, position });

        // 탭을 찾아서 현재 영역 확인
        const allTabs = [...currentTabAreas.left, ...currentTabAreas.center, ...currentTabAreas.right];
        const tab = allTabs.find(t => t.id === tabId);
        if (!tab) return;

        // 현재 탭이 어느 영역에 있는지 찾기
        const currentArea = currentTabAreas.left.find(t => t.id === tabId) ? 'left' :
            currentTabAreas.center.find(t => t.id === tabId) ? 'center' : 'right';

        // 분할 모드 자동 설정
        if (position === 'left' || position === 'right') {
            if (splitMode === 'single') {
                setSplitMode('double');
            }
        } else if (position === 'center') {
            setSplitMode('triple');
        }

        // 탭을 해당 영역으로 이동
        const targetArea: TabArea = position === 'center' ? 'center' : position as TabArea;

        if (currentArea !== targetArea) {
            handleTabMove(tabId, currentArea as TabArea, targetArea);
        }
    };

    // 분할 모드 변경 핸들러
    const handleSplitModeChange = (mode: SplitMode) => {
        setSplitMode(mode);

        if (mode === 'single') {
            // 모든 탭을 left 영역으로 이동
            setTabAreas(prev => ({
                left: [...prev.left, ...prev.center, ...prev.right],
                center: [],
                right: []
            }));
        }
    };

    // 탭 닫기 핸들러
    const handleTabClose = (tabId: string) => {
        const allTabs = [...currentTabAreas.left, ...currentTabAreas.center, ...currentTabAreas.right];
        const currentIndex = allTabs.findIndex(tab => tab.id === tabId);
        const isActiveTab = activeTabId === tabId;

        // 탭 삭제
        removeTab(tabId);

        // 영역별 상태에서도 제거
        setTabAreas(prev => ({
            left: prev.left.filter(tab => tab.id !== tabId),
            center: prev.center.filter(tab => tab.id !== tabId),
            right: prev.right.filter(tab => tab.id !== tabId)
        }));

        // 활성 탭 처리 (기존 로직 유지)
        if (isActiveTab) {
            const remainingTabs = allTabs.filter(tab => tab.id !== tabId);
            if (remainingTabs.length > 0) {
                let targetTab;
                if (currentIndex > 0) {
                    targetTab = remainingTabs[currentIndex - 1];
                } else {
                    targetTab = remainingTabs[0];
                }

                setActiveTab(targetTab.id);
                if (targetTab?.href) {
                    setFilteredTop(targetTab.menuNo || '');
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo: targetTab.menuNo } }));
                    }
                    router.push(targetTab.href);
                }
            } else {
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

                    {/* 드롭존을 전체 컨텐츠 영역에 적용 */}
                    <DropZoneOverlay
                        isDragActive={isDragActive}
                        activeDropZone={activeDropZone}
                        className="flex-1 bg-white flex flex-col"
                    >
                        {/* 탭바 영역 */}
                        <div className="border-b border-gray-200 bg-white">
                            <div className="px-6">
                                <TabGroup
                                    splitMode={splitMode}
                                    areas={currentTabAreas}
                                    activeTabByArea={{
                                        left: activeTopNo || null,
                                        center: null,
                                        right: null
                                    }}
                                    onTabChange={handleTabChange}
                                    onTabClose={handleTabClose}
                                    onTabReorder={handleTabReorder}
                                    onTabMove={handleTabMove}
                                    onDropZoneDrop={handleDropZoneDrop}
                                    onSplitModeChange={handleSplitModeChange}
                                    // 드래그 상태를 상위로 전달
                                    onDragStateChange={(isActive, dropZone) => {
                                        setIsDragActive(isActive);
                                        setActiveDropZone(dropZone);
                                    }}
                                />
                            </div>
                        </div>

                        {/* 본문 영역 - 분할 모드에 따라 레이아웃 */}
                        <div className={`flex-1 overflow-hidden grid gap-1 ${splitMode === 'single' ? 'grid-cols-1' :
                                splitMode === 'double' ? 'grid-cols-2' :
                                    'grid-cols-3'
                            }`}>
                            {splitMode === 'single' ? (
                                <div className="overflow-auto">
                                    {children}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-auto border-r">
                                        {/* Left 영역 컨텐츠 */}
                                        {children}
                                    </div>
                                    {splitMode === 'triple' && (
                                        <div className="overflow-auto border-r">
                                            {/* Center 영역 컨텐츠 */}
                                            <div className="p-4 text-gray-500">Center 영역</div>
                                        </div>
                                    )}
                                    <div className="overflow-auto">
                                        {/* Right 영역 컨텐츠 */}
                                        <div className="p-4 text-gray-500">Right 영역</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </DropZoneOverlay>
                </main>
            </div>
        </ProtectedRoute>
    );
}
