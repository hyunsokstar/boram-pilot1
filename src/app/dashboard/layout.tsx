"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
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
    const [draggedTab, setDraggedTab] = useState<{ id: string; label: string } | null>(null);

    // 드래그 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
        // 영역 상태가 비어있으면 모든 탭을 left 영역에 배치
        const hasAnyTabs = tabAreas.left.length > 0 || tabAreas.center.length > 0 || tabAreas.right.length > 0;
        
        if (!hasAnyTabs) {
            return {
                left: tabs,
                center: [],
                right: []
            };
        }
        
        // 기존 영역 상태 유지하되, 스토어에만 있고 영역에 없는 새 탭들을 left에 추가
        const allAreaTabs = [...tabAreas.left, ...tabAreas.center, ...tabAreas.right];
        const newTabs = tabs.filter(tab => !allAreaTabs.some(areaTab => areaTab.id === tab.id));
        
        return {
            left: [...tabAreas.left, ...newTabs],
            center: tabAreas.center,
            right: tabAreas.right
        };
    }, [tabs, tabAreas]);

    // 현재 활성 탭 계산
    const activeTopNo = useMemo(
        () => (pathname ? findTopByPath(pathname)?.menuNo ?? null : null),
        [pathname]
    );

    // 드래그 시작 핸들러
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeData = active.data?.current;

        // 탭이 아닌 경우 드래그 중단
        if (!activeData || activeData.type !== 'tab') return;

        const tabId = String(active.id);
        setIsDragActive(true);

        // 드래그 중인 탭 정보 설정
        setDraggedTab({
            id: tabId,
            label: activeData.label || tabId
        });
    };

    // 드래그 오버 핸들러 (드롭존 호버 감지)
    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;

        if (over?.data?.current?.type === 'dropzone') {
            const position = over.data.current.position as DropPosition;
            console.log('드롭존 호버:', position);
            setActiveDropZone(position);
        } else {
            setActiveDropZone(null);
        }
    };

    // 드래그 종료 핸들러
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // 드래그 상태 초기화
        setIsDragActive(false);
        setActiveDropZone(null);
        setDraggedTab(null);

        if (!over || !active.data?.current) return;

        const draggedTabId = String(active.id);
        const activeData = active.data.current;

        // 탭이 아닌 경우 무시
        if (activeData.type !== 'tab') return;

        // 드롭존에 드롭된 경우
        if (over.data?.current?.type === 'dropzone') {
            const position = over.data.current.position as DropPosition;
            console.log('드롭존에 드롭:', position, '탭:', draggedTabId);
            handleDropZoneDrop(draggedTabId, position);
            return;
        }

        // 다른 탭에 드롭된 경우 (순서 변경)
        if (over.data?.current?.type === 'tab') {
            const targetTabId = String(over.id);
            const allTabs = [...currentTabAreas.left, ...currentTabAreas.center, ...currentTabAreas.right];

            const draggedTab = allTabs.find(t => t.id === draggedTabId);
            const targetTab = allTabs.find(t => t.id === targetTabId);

            if (!draggedTab || !targetTab) return;

            // 탭 영역 찾기
            const fromArea = currentTabAreas.left.find(t => t.id === draggedTabId) ? 'left' :
                currentTabAreas.center.find(t => t.id === draggedTabId) ? 'center' : 'right';
            const toArea = currentTabAreas.left.find(t => t.id === targetTabId) ? 'left' :
                currentTabAreas.center.find(t => t.id === targetTabId) ? 'center' : 'right';

            if (fromArea === toArea) {
                // 같은 영역 내 순서 변경
                const areaItems = currentTabAreas[fromArea as TabArea];
                const oldIndex = areaItems.findIndex(tab => tab.id === draggedTabId);
                const newIndex = areaItems.findIndex(tab => tab.id === targetTabId);
                if (oldIndex !== -1 && newIndex !== -1) {
                    handleTabReorder(oldIndex, newIndex, fromArea as TabArea);
                }
            } else {
                // 다른 영역으로 이동
                const targetAreaItems = currentTabAreas[toArea as TabArea];
                const targetIndex = targetAreaItems.findIndex(tab => tab.id === targetTabId);
                handleTabMove(draggedTabId, fromArea as TabArea, toArea as TabArea, targetIndex);
            }
        }
    };
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
        console.log('드롭존 처리 시작:', { tabId, position, currentTabAreas });

        // 탭을 찾아서 현재 영역 확인
        const allTabs = [...currentTabAreas.left, ...currentTabAreas.center, ...currentTabAreas.right];
        const tab = allTabs.find(t => t.id === tabId);
        if (!tab) {
            console.log('탭을 찾을 수 없음:', tabId);
            return;
        }

        // 현재 탭이 어느 영역에 있는지 찾기
        const currentArea = currentTabAreas.left.find(t => t.id === tabId) ? 'left' :
            currentTabAreas.center.find(t => t.id === tabId) ? 'center' : 'right';

        console.log('현재 영역:', currentArea, '목표 위치:', position);

        // 분할 모드 자동 설정
        let nextSplitMode = splitMode;
        if (position === 'left' || position === 'right') {
            if (splitMode === 'single') {
                nextSplitMode = 'double';
                setSplitMode('double');
                console.log('분할 모드 변경: single → double');
            }
        } else if (position === 'center') {
            nextSplitMode = 'triple';
            setSplitMode('triple');
            console.log('분할 모드 변경: → triple');
        }

        // 탭을 해당 영역으로 이동
        const targetArea: TabArea = position === 'center' ? 'center' : position as TabArea;

        console.log('탭 이동:', { from: currentArea, to: targetArea });

        setTabAreas(prev => {
            const newAreas = { ...prev };
            // 원본 영역에서 탭 제거
            newAreas[currentArea] = newAreas[currentArea].filter(t => t.id !== tabId);
            // 목표 영역에 탭 추가 (마지막에 추가)
            newAreas[targetArea] = [...newAreas[targetArea], tab];

            console.log('탭 영역 업데이트:', newAreas);
            return newAreas;
        });

        // 이동된 탭을 활성화
        setActiveTab(tabId);
        console.log('탭 활성화:', tabId);
    };    // 분할 모드 변경 핸들러
    const handleSplitModeChange = (mode: SplitMode) => {
        console.log('분할 모드 변경:', splitMode, '→', mode);
        setSplitMode(mode);

        if (mode === 'single') {
            // 모든 탭을 left 영역으로 이동
            setTabAreas(prev => {
                const allTabs = [...prev.left, ...prev.center, ...prev.right];
                console.log('single 모드로 변경, 모든 탭을 left로 이동:', allTabs.length, '개');
                return {
                    left: allTabs,
                    center: [],
                    right: []
                };
            });
        } else if (mode === 'double' && splitMode === 'single') {
            // single에서 double로 변경 시, 기존 탭들을 left에 유지
            console.log('double 모드로 변경, left 영역 탭 유지');
            // tabAreas는 그대로 유지 (left에 모든 탭이 있음)
        } else if (mode === 'triple' && (splitMode === 'single' || splitMode === 'double')) {
            // triple로 변경 시, 기존 탭들을 left에 유지
            console.log('triple 모드로 변경, left 영역 탭 유지');
            // tabAreas는 그대로 유지
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

                    {/* 전체 DndContext로 감싸기 */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex-1 bg-white flex flex-col relative">
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
                                    // DndContext를 상위로 옮겼으므로 필요 없음
                                    />
                                </div>
                            </div>

                            {/* 본문 영역 - 분할 모드에 따라 레이아웃 */}
                            <DropZoneOverlay
                                isDragActive={isDragActive}
                                activeDropZone={activeDropZone}
                                className="flex-1 overflow-hidden"
                            >
                                <div className={`h-full grid gap-1 ${splitMode === 'single' ? 'grid-cols-1' :
                                    splitMode === 'double' ? 'grid-cols-2' :
                                        'grid-cols-3'
                                    }`}>
                                    {splitMode === 'single' ? (
                                        <div className="overflow-auto">
                                            {currentTabAreas.left.length > 0 ? children : (
                                                <div className="p-8 text-gray-400 text-center">헤더 메뉴를 클릭하여 탭을 추가하세요</div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-auto border-r">
                                                {/* Left 영역 컨텐츠 */}
                                                {currentTabAreas.left.length > 0 ? children : (
                                                    <div className="p-8 text-gray-400 text-center">Left 영역에 탭을 드래그하세요</div>
                                                )}
                                            </div>
                                            {splitMode === 'triple' && (
                                                <div className="overflow-auto border-r">
                                                    {/* Center 영역 컨텐츠 */}
                                                    {currentTabAreas.center.length > 0 ? children : (
                                                        <div className="p-8 text-gray-400 text-center">Center 영역에 탭을 드래그하세요</div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="overflow-auto">
                                                {/* Right 영역 컨텐츠 */}
                                                {currentTabAreas.right.length > 0 ? children : (
                                                    <div className="p-8 text-gray-400 text-center">Right 영역에 탭을 드래그하세요</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </DropZoneOverlay>

                            {/* 드래그 오버레이 */}
                            <DragOverlay>
                                {draggedTab && isDragActive ? (
                                    <div
                                        className="flex items-center px-3 py-2 border-2 border-blue-500 text-blue-700 bg-blue-50 font-medium text-sm cursor-pointer shadow-lg rounded"
                                        style={{
                                            maxWidth: '200px',
                                            minWidth: '120px',
                                            height: '36px',
                                            fontSize: '14px',
                                            transform: 'none',
                                            scale: '1'
                                        }}
                                    >
                                        {/* 드래그 핸들 아이콘 */}
                                        <div className="mr-2 opacity-60 flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 6h2v2H8zm0 4h2v2H8zm0 4h2v2H8zm6-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z" />
                                            </svg>
                                        </div>
                                        {/* 탭 라벨 */}
                                        <span className="whitespace-nowrap select-none truncate flex-1">
                                            {draggedTab.label}
                                        </span>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </div>
                    </DndContext>
                </main>
            </div>
        </ProtectedRoute>
    );
}
