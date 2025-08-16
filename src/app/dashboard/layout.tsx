"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    useDroppable,
    CollisionDetection,
    rectIntersection,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { ResizablePanelGroup } from "@/widgets/dashboard-tab-bar";
import DropZoneOverlay, { DropPosition } from "@/widgets/dashboard-tab-bar/ui/drop-zone-overlay";
import type { TabArea } from "@/widgets/dashboard-tab-bar";
import { useTabStore, restoreFromLocalStorage } from "@/widgets/dashboard-tab-bar/model/tabStore";
import { ProtectedRoute } from "@/shared/ui";
import { NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { useNavStore } from "@/shared/store/navStore";

// 확장된 드롭존 컴포넌트
function ExpandedDropZone({ area }: { area: TabArea }) {
    const splitMode = useTabStore((state) => state.splitMode);

    // 1영역일 때는 드롭존 비활성화
    const isDropZoneEnabled = splitMode !== 'single';

    const { setNodeRef, isOver } = useDroppable({
        id: `expanded-tab-area-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
        disabled: !isDropZoneEnabled,
    });

    return (
        <div
            ref={isDropZoneEnabled ? setNodeRef : undefined}
            className={`h-full w-full transition-all duration-200 rounded-lg relative ${isOver && isDropZoneEnabled
                ? 'bg-blue-100/50 border-2 border-dashed border-blue-400 scale-[0.98]'
                : 'bg-transparent'
                }`}
            style={{
                // 더 큰 감지 영역을 위한 확장된 padding
                padding: '8px',
                margin: '-8px',
                minHeight: '200px', // 최소 높이 보장
            }}
        >
            {/* 드롭 가능 영역 시각적 힌트 */}
            {isDropZoneEnabled && (
                <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded-lg opacity-30 pointer-events-none transition-opacity duration-200 hover:opacity-60" />
            )}
            
            {/* 드롭 활성화 시 강조 표시 */}
            {isOver && isDropZoneEnabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium">
                        📁 탭을 여기에 드롭하세요
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);

    // 드래그 앤 드롭 상태만 로컬로 관리
    const [isDragActive, setIsDragActive] = useState(false);
    const [activeDropZone, setActiveDropZone] = useState<DropPosition | null>(null);
    const [draggedTab, setDraggedTab] = useState<{ id: string; label: string } | null>(null);

    // Zustand 탭 스토어 사용 (splitMode 포함)
    const {
        tabAreas,
        activeTabsByArea,
        splitMode,
        removeTab,
        moveTab: moveTabToArea,
        reorderTabsInArea,
        setActiveTab,
        setActiveTabByArea,
        setSplitMode,
        getTabsForArea,
        findTabById
    } = useTabStore();

    // 클라이언트에서 localStorage 상태 복원
    useEffect(() => {
        restoreFromLocalStorage();
    }, []);

    // 드래그 센서 설정 - 더 민감한 반응을 위해 거리 줄임
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // 8에서 3으로 줄여서 더 빠른 반응
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 커스텀 collision detection - 더 민감한 감지 및 main-content-split 우선시
    const customCollisionDetection: CollisionDetection = (args) => {
        const { droppableContainers, active, pointerCoordinates } = args;

        // main-content-split drop zone 확인 (single 모드에서만)
        const mainContentSplitZone = droppableContainers.find(
            container => container.id === 'main-content-split'
        );

        if (mainContentSplitZone) {
            // rectIntersection으로 main-content-split과의 충돌 확인
            const intersections = rectIntersection({
                ...args,
                droppableContainers: [mainContentSplitZone]
            });

            if (intersections.length > 0) {
                console.log('Main content split zone detected - prioritizing over tab reordering');
                return intersections;
            }
        }

        // 2영역 이상일 때 더 민감한 감지를 위한 확장된 collision detection
        const expandedDropZones = droppableContainers.filter(
            container => String(container.id).includes('expanded-tab-area-')
        );

        if (expandedDropZones.length > 0 && pointerCoordinates) {
            // 각 드롭존에 대해 확장된 감지 영역 적용
            const expandedIntersections = expandedDropZones.map(container => {
                const rect = container.rect.current;
                if (!rect) return null;

                // 감지 영역을 20px씩 확장
                const expandedRect = {
                    ...rect,
                    top: rect.top - 20,
                    bottom: rect.bottom + 20,
                    left: rect.left - 20,
                    right: rect.right + 20,
                };

                // 포인터가 확장된 영역 안에 있는지 확인
                const isInExpandedArea = 
                    pointerCoordinates.x >= expandedRect.left &&
                    pointerCoordinates.x <= expandedRect.right &&
                    pointerCoordinates.y >= expandedRect.top &&
                    pointerCoordinates.y <= expandedRect.bottom;

                if (isInExpandedArea) {
                    return {
                        id: container.id,
                        data: container.data
                    };
                }
                return null;
            }).filter((item): item is { id: any; data: any } => item !== null);

            if (expandedIntersections.length > 0) {
                console.log('Expanded drop zone detected:', expandedIntersections);
                return expandedIntersections;
            }
        }

        // 기본 collision detection 사용
        return closestCenter(args);
    };

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

        console.log('드래그 시작:', { tabId, splitMode });
    };

    // 드래그 오버 핸들러 (드롭존 호버 감지)
    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;

        if (over) {
            console.log('드래그 오버:', {
                overId: over.id,
                overType: over.data?.current?.type,
                splitMode
            });
        }

        // 메인 콘텐츠 분할 드롭존 처리 (1영역에서 2영역 분할)
        if (over?.id === 'main-content-split' && splitMode === 'single') {
            console.log('🟢 메인 콘텐츠 분할 드롭존 호버');
            setActiveDropZone(null); // 다른 드롭존 비활성화
        } else if (over?.data?.current?.type === 'dropzone') {
            const position = over.data.current.position as DropPosition;
            console.log('드롭존 호버:', position);
            setActiveDropZone(position);
        } else if (over?.id?.toString().startsWith('double-dropzone-')) {
            // DoubleSplitOverlay 드롭존
            const position = over.data?.current?.position;
            console.log('2단 드롭존 호버:', position);
            if (position) {
                setActiveDropZone(position);
            }
        } else if (over?.id?.toString().startsWith('triple-dropzone-')) {
            // TripleSplitOverlay 드롭존
            const position = over.data?.current?.position;
            console.log('3단 드롭존 호버:', position);
            if (position) {
                setActiveDropZone(position);
            }
        } else if (over?.data?.current?.type === 'tab-area') {
            const area = over.data.current.area as TabArea;
            console.log('탭바 영역 호버:', area);
            // 탭바 영역에 대한 시각적 피드백은 TabBar 컴포넌트에서 isOver로 처리
            setActiveDropZone(null);
        } else if (over?.id?.toString().startsWith('tab-end-')) {
            // EndDropZone 호버
            const area = over.data?.current?.area as TabArea;
            console.log('EndDropZone 호버:', area);
            setActiveDropZone(null);
        } else {
            setActiveDropZone(null);
        }
    };

    // 간단한 드롭존 처리 함수
    const handleDropZoneDrop = (tabId: string, position: DropPosition) => {
        console.log('드롭존 처리:', { tabId, position });

        const tabInfo = findTabById(tabId);
        if (!tabInfo) return;

        // position에 따라 splitMode 설정 및 탭 이동
        switch (position) {
            case 'left':
                if (splitMode === 'single') {
                    setSplitMode('double');
                }
                moveTabToArea(tabId, tabInfo.area, 'left');
                break;
            case 'right':
                if (splitMode === 'single') {
                    setSplitMode('double');
                } else if (splitMode === 'double') {
                    setSplitMode('triple');
                }
                moveTabToArea(tabId, tabInfo.area, 'right');
                break;
            case 'center':
                if (splitMode === 'double') {
                    setSplitMode('triple');
                }
                moveTabToArea(tabId, tabInfo.area, 'center');
                break;
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

        console.log('handleDragEnd:', { draggedTabId, overType: over.data?.current?.type, overId: over.id });

        // 메인 콘텐츠 분할 드롭 우선 처리 (1영역에서 2영역으로 분할)
        if (over.id === 'main-content-split' && splitMode === 'single') {
            console.log('메인 콘텐츠 분할 드롭:', { draggedTabId });

            const tabInfo = findTabById(draggedTabId);
            if (tabInfo) {
                // 2영역으로 분할
                setSplitMode('double');
                // 드래그한 탭을 right 영역으로 이동
                moveTabToArea(draggedTabId, tabInfo.area, 'right');
            }
            return;
        }

        // SortableContext 내부의 순서 변경인지 확인
        // (같은 영역 내에서 탭끼리 드래그한 경우)
        if (over.data?.current?.type === 'tab' && activeData.area) {
            const targetTabId = String(over.id);
            const targetData = over.data.current;

            console.log('탭간 드래그:', { draggedTabId, targetTabId, area: activeData.area });

            // 같은 영역 내에서 순서 변경
            if (activeData.area === targetData.area) {
                const sourceIndex = getTabsForArea(activeData.area as TabArea).findIndex(t => t.id === draggedTabId);
                const destinationIndex = getTabsForArea(activeData.area as TabArea).findIndex(t => t.id === targetTabId);
                if (sourceIndex !== -1 && destinationIndex !== -1) {
                    reorderTabsInArea(activeData.area as TabArea, sourceIndex, destinationIndex);
                }
            }
            return;
        }

        // 탭 영역으로 드래그 (확장된 드롭존 포함)
        if (over.data?.current?.type === 'tab-area') {
            const targetArea = over.data.current.area as TabArea;
            console.log('탭 영역으로 드래그:', { draggedTabId, targetArea });

            const tabInfo = findTabById(draggedTabId);
            if (tabInfo) {
                moveTabToArea(draggedTabId, tabInfo.area, targetArea);
            }
            return;
        }

        // EndDropZone으로 드래그 (탭 영역 끝부분)
        if (over?.id?.toString().startsWith('tab-end-')) {
            const targetArea = over.data?.current?.area as TabArea;
            console.log('EndDropZone으로 드래그:', { draggedTabId, targetArea });

            const tabInfo = findTabById(draggedTabId);
            if (tabInfo) {
                moveTabToArea(draggedTabId, tabInfo.area, targetArea);
            }
            return;
        }

        // 드롭존으로 드래그 처리
        if (over?.data?.current?.type === 'dropzone') {
            const position = over.data.current.position as DropPosition;
            console.log('드롭존에 드롭:', position, '탭:', draggedTabId);
            handleDropZoneDrop(draggedTabId, position);
            return;
        }
        // DoubleSplitOverlay 드롭존에 드롭된 경우
        else if (over.id?.toString().startsWith('double-dropzone-')) {
            const position = over.data?.current?.position;
            console.log('2단 드롭존에 드롭:', position, '탭:', draggedTabId);
            if (position) {
                handleDropZoneDrop(draggedTabId, position);
            }
            return;
        }
        // TripleSplitOverlay 드롭존에 드롭된 경우
        else if (over.id?.toString().startsWith('triple-dropzone-')) {
            const position = over.data?.current?.position;
            console.log('3단 드롭존에 드롭:', position, '탭:', draggedTabId);
            if (position) {
                handleDropZoneDrop(draggedTabId, position);
            }
            return;
        }
    };

    // 탭 클릭 핸들러
    const handleTabChange = (tabId: string, area: TabArea) => {
        console.log('handleTabChange 호출:', { tabId, area, splitMode });

        const selectedTabInfo = findTabById(tabId);
        if (!selectedTabInfo) {
            console.log('선택된 탭을 찾을 수 없음:', tabId);
            return;
        }

        const selectedTab = selectedTabInfo.tab;

        // Zustand 스토어에 직접 설정
        setActiveTabByArea(area, tabId);

        // 전역 활성 탭도 설정 (기존 로직 유지)
        setActiveTab(tabId);
        setFilteredTop(selectedTab.menuNo || '');

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo: selectedTab.menuNo } }));
        }

        // 분할 모드가 single인 경우에만 실제 라우팅 수행
        if (splitMode === 'single' && selectedTab.href && selectedTab.href.trim() !== "") {
            router.push(selectedTab.href);
        }
    };

    // 각 영역의 활성 탭에 따른 컨텐츠 렌더링
    const renderAreaContent = (area: TabArea) => {
        const activeTabId = activeTabsByArea[area];
        const areaTabs = getTabsForArea(area);

        if (areaTabs.length === 0) {
            return (
                <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <div className="text-lg mb-2">탭이 없습니다</div>
                        <div className="text-sm">여기로 탭을 드래그하세요</div>
                    </div>
                </div>
            );
        }

        // 활성 탭이 없으면 첫 번째 탭을 기본으로 표시
        const displayTabId = activeTabId || areaTabs[0]?.id;
        const activeTab = areaTabs.find(tab => tab && tab.id === displayTabId);

        if (!activeTab) {
            return <div className="p-8 text-gray-400 text-center">탭을 선택하세요</div>;
        }

        // single 모드에서는 기존 children 사용
        if (splitMode === 'single') {
            return children;
        }

        // 분할 모드에서는 탭에 포함된 view 우선 렌더링, 없으면 href 기반 레지스트리 조회
        const Comp = activeTab.view || resolveViewByHref(activeTab.href);

        return Comp ? <Comp /> : <div className="p-8 text-gray-400 text-center">뷰를 찾을 수 없습니다</div>;
    };

    return (
        <ProtectedRoute>
            <DndContext
                sensors={sensors}
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col h-screen bg-gray-50">
                    {/* 헤더 - 전체 상단 */}
                    <DashboardHeader />

                    {/* 본문 영역 - 사이드바 + 메인 콘텐츠 */}
                    <div className="flex flex-1 overflow-hidden">
                        <DashboardSidebar />
                        <div className="flex-1 relative">
                            {/* 탭 추가 시 전체 오버레이 효과 - 임시 비활성화 */}
                            {false && isDragActive && (
                                <DropZoneOverlay
                                    isDragActive={isDragActive}
                                    activeDropZone={activeDropZone}
                                    currentSplitMode={splitMode}
                                    onDrop={(position: DropPosition) => {
                                        const draggedTabId = draggedTab?.id;
                                        if (draggedTabId) {
                                            handleDropZoneDrop(draggedTabId, position);
                                        }
                                    }}
                                >
                                    <div className="h-full" />
                                </DropZoneOverlay>
                            )}

                            {/* 통합된 탭바 + 콘텐츠 리사이즈 패널 */}
                            <div className="absolute inset-0">
                                <ResizablePanelGroup
                                    splitMode={splitMode}
                                    isDragActive={isDragActive}
                                    tabAreas={tabAreas}
                                    activeTabsByArea={activeTabsByArea}
                                    onTabChange={handleTabChange}
                                    onTabClose={removeTab}
                                    onSplitModeChange={setSplitMode}
                                    renderAreaContent={renderAreaContent}
                                    ExpandedDropZone={ExpandedDropZone}
                                    moveTabToArea={moveTabToArea}
                                    getTabsForArea={getTabsForArea}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 드래그 오버레이 */}
                <DragOverlay>
                    {draggedTab && (
                        <div className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow-lg text-sm font-medium cursor-grabbing">
                            {draggedTab.label}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </ProtectedRoute>
    );
}
