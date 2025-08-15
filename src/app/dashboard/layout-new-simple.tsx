"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { resolveViewByHref } from "@/widgets/dashboard-views/registry";
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
    DragOverEvent,
    useDroppable
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { TabGroup, DoubleSplitOverlay, TripleSplitOverlay } from "@/widgets/dashboard-tab-bar";
import type { SplitMode, DropPosition, TabArea } from "@/widgets/dashboard-tab-bar";
import { useTabStore } from "@/widgets/dashboard-tab-bar/model/tabStore";
import { ProtectedRoute } from "@/shared/ui";
import { NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { useNavStore } from "@/shared/store/navStore";

// 확장된 드롭존 컴포넌트
function ExpandedDropZone({ area }: { area: TabArea }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `expanded-tab-area-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`h-full transition-all duration-200 rounded-lg ${isOver
                ? 'bg-blue-100/50 border-2 border-dashed border-blue-400 scale-[0.98]'
                : 'bg-transparent'
                }`}
        >
            {isOver && (
                <div className="h-full flex items-center justify-center">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                        {area === 'left' ? '왼쪽' : area === 'center' ? '가운데' : '오른쪽'} 영역에 드롭
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);

    // 분할 모드와 드래그 상태만 로컬에서 관리
    const [splitMode, setSplitMode] = useState<SplitMode>('single');
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

    // Zustand 스토어 사용
    const {
        tabs,
        activeTabId,
        tabsByArea,
        activeTabsByArea,
        getTabsForArea,
        getAllAreas,
        addTab,
        removeTab,
        setActiveTab,
        moveTab,
        setActiveTabByArea
    } = useTabStore();

    // 탭이 없는 영역을 위한 기본 영역 보장
    useEffect(() => {
        const areas = getAllAreas();
        if (areas.length === 0 && tabs.length === 0) {
            // 초기 상태에서는 기본 영역들을 설정할 필요 없음
            console.log('탭과 영역이 모두 비어있음');
        }
    }, [tabs, getAllAreas]);

    // 현재 각 영역의 탭들 가져오기
    const leftTabs = getTabsForArea('left');
    const centerTabs = getTabsForArea('center');
    const rightTabs = getTabsForArea('right');

    // 전체 탭 수에 따른 분할 모드 자동 조정
    const totalTabs = leftTabs.length + centerTabs.length + rightTabs.length;
    
    useEffect(() => {
        const usedAreas = getAllAreas().filter(area => getTabsForArea(area).length > 0);
        
        if (usedAreas.length <= 1) {
            setSplitMode('single');
        } else if (usedAreas.length === 2) {
            setSplitMode('double');
        } else {
            setSplitMode('triple');
        }
    }, [leftTabs.length, centerTabs.length, rightTabs.length, getAllAreas, getTabsForArea]);

    // href 변경 시 새 탭 추가
    useEffect(() => {
        const href = window.location.pathname;
        const resolvedComponent = resolveViewByHref(href);

        if (resolvedComponent && resolvedComponent.menuNo) {
            const newTab = {
                id: `tab-${Date.now()}`,
                label: resolvedComponent.label,
                href: href,
                menuNo: resolvedComponent.menuNo,
                isClosable: true
            };

            // 기본적으로 left 영역에 추가
            addTab(newTab, 'left');
        }
    }, [addTab]);

    // 탭 제거 핸들러
    const handleTabRemove = (tabId: string) => {
        removeTab(tabId);
    };

    // 탭 클릭 핸들러
    const handleTabClick = (tabId: string, href: string, area: TabArea) => {
        setActiveTab(tabId);
        setActiveTabByArea(area, tabId);
        router.push(href);
    };

    // 드래그 시작 핸들러
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const tabData = active.data.current;

        if (tabData?.type === 'tab') {
            setDraggedTab({
                id: active.id as string,
                label: tabData.label
            });
            setIsDragActive(true);
        }
    };

    // 드래그 오버 핸들러
    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        
        if (over?.data.current?.type === 'split-zone') {
            setActiveDropZone(over.data.current.position);
        } else if (over?.data.current?.type === 'tab-area') {
            setActiveDropZone(null);
        } else {
            setActiveDropZone(null);
        }
    };

    // 드래그 종료 핸들러
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setIsDragActive(false);
        setActiveDropZone(null);
        setDraggedTab(null);

        if (!over) return;

        const draggedTabId = active.id as string;
        const draggedTabData = active.data.current;
        
        // 드래그된 탭의 현재 영역 찾기
        const fromArea = Object.keys(tabsByArea).find(area => 
            tabsByArea[area].includes(draggedTabId)
        ) as TabArea;

        if (!fromArea) return;

        // 분할 영역으로 드롭
        if (over.data.current?.type === 'split-zone') {
            const position = over.data.current.position as DropPosition;
            const targetArea: TabArea = position === 'left' ? 'left' : position === 'right' ? 'right' : 'center';
            
            if (fromArea !== targetArea) {
                // 끝에 추가 (position 생략하면 기본적으로 끝에 추가됨)
                moveTab(draggedTabId, fromArea, targetArea);
                console.log(`탭을 ${fromArea}에서 ${targetArea} 영역 끝으로 이동:`, draggedTabData?.label);
            }
        }
        // 기존 탭 영역으로 드롭
        else if (over.data.current?.type === 'tab-area') {
            const targetArea = over.data.current.area as TabArea;
            
            if (fromArea !== targetArea) {
                // 끝에 추가
                moveTab(draggedTabId, fromArea, targetArea);
                console.log(`탭을 ${fromArea}에서 ${targetArea} 영역 끝으로 이동:`, draggedTabData?.label);
            }
        }
    };

    // 메뉴 클릭 이벤트 처리
    useEffect(() => {
        const handleTopMenu = (e: CustomEvent<any>) => {
            const menuInfo = e.detail;
            console.log("상단 메뉴 클릭:", menuInfo);

            setFilteredTop((currentItems) => {
                const isAlreadyAdded = currentItems.some(item => item.href === menuInfo.href);
                if (!isAlreadyAdded) {
                    return [...currentItems, menuInfo];
                }
                return currentItems;
            });

            const newTab = {
                id: `tab-${Date.now()}`,
                label: menuInfo.label,
                href: menuInfo.href,
                menuNo: menuInfo.menuNo,
                isClosable: true
            };

            // 기본적으로 left 영역에 추가
            addTab(newTab, 'left');
        };

        window.addEventListener(NAV_OPEN_TOP_EVENT, handleTopMenu as EventListener);
        return () => {
            window.removeEventListener(NAV_OPEN_TOP_EVENT, handleTopMenu as EventListener);
        };
    }, [setFilteredTop, addTab]);

    // 현재 활성 탭 결정
    const getCurrentTab = () => {
        return tabs.find(tab => tab.id === activeTabId);
    };

    const currentTab = getCurrentTab();

    return (
        <ProtectedRoute>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="h-screen flex flex-col bg-gray-50">
                    <DashboardHeader />
                    
                    <div className="flex flex-1 overflow-hidden">
                        <DashboardSidebar />
                        
                        <main className="flex-1 flex flex-col overflow-hidden bg-white">
                            {totalTabs > 0 && (
                                <div className="flex-none border-b border-gray-200">
                                    <TabGroup
                                        leftTabs={leftTabs}
                                        centerTabs={centerTabs}
                                        rightTabs={rightTabs}
                                        splitMode={splitMode}
                                        onTabClick={handleTabClick}
                                        onTabRemove={handleTabRemove}
                                        activeLeftTabId={activeTabsByArea.left}
                                        activeCenterTabId={activeTabsByArea.center}
                                        activeRightTabId={activeTabsByArea.right}
                                    />
                                </div>
                            )}
                            
                            <div className="flex-1 relative overflow-hidden">
                                {/* 메인 콘텐츠 영역 */}
                                <div className="h-full">
                                    {totalTabs === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center text-gray-500">
                                                <p className="text-lg mb-2">열린 탭이 없습니다</p>
                                                <p className="text-sm">사이드바에서 메뉴를 선택해주세요</p>
                                            </div>
                                        </div>
                                    ) : (
                                        children
                                    )}
                                </div>

                                {/* 드래그 활성화 시 표시되는 오버레이 */}
                                {isDragActive && (
                                    <>
                                        {splitMode === 'single' && (
                                            <DoubleSplitOverlay 
                                                activeZone={activeDropZone} 
                                                onSplitModeChange={setSplitMode}
                                            />
                                        )}
                                        {splitMode === 'double' && (
                                            <TripleSplitOverlay 
                                                activeZone={activeDropZone} 
                                                onSplitModeChange={setSplitMode}
                                            />
                                        )}
                                        {splitMode === 'triple' && (
                                            <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 pointer-events-none z-10">
                                                <ExpandedDropZone area="left" />
                                                <ExpandedDropZone area="center" />
                                                <ExpandedDropZone area="right" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </main>
                    </div>
                </div>

                {/* 드래그 오버레이 */}
                <DragOverlay>
                    {draggedTab && (
                        <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg">
                            <span className="text-sm font-medium">{draggedTab.label}</span>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </ProtectedRoute>
    );
}
