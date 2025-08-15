"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { DoubleSplitOverlay, TripleSplitOverlay, ResizablePanelGroup } from "@/widgets/dashboard-tab-bar";
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

    // TabGroup 상태 관리
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

    // Zustand 탭 스토어 사용 (간단한 버전)
    const {
        tabAreas,
        activeTabsByArea,
        removeTab,
        moveTab: moveTabToArea,
        reorderTabsInArea,
        setActiveTab,
        setActiveTabByArea,
        getTabsForArea,
        findTabById
    } = useTabStore();

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
                // triple 모드에서만 center 영역 사용
                if (splitMode === 'double') {
                    setSplitMode('triple');
                    moveTabToArea(tabId, tabInfo.area, 'center');
                }
                break;
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
            const areaNames = {
                left: splitMode === 'single' ? '헤더 메뉴를 클릭하여 탭을 추가하세요' : 'Left 영역에 탭을 드래그하세요',
                center: 'Center 영역에 탭을 드래그하세요',
                right: 'Right 영역에 탭을 드래그하세요'
            };
            return <div className="p-8 text-gray-400 text-center">{areaNames[area]}</div>;
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
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-screen bg-gray-50">
                    <DashboardSidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <DashboardHeader />
                        <div className="flex-1 relative">
                            {/* 드래그 시 오버레이 (배경 그리드) */}
                            {isDragActive && (
                                <>
                                    {splitMode === 'single' && (
                                        <DoubleSplitOverlay
                                            isDragActive={isDragActive}
                                            activeDropZone={activeDropZone as 'left' | 'right' | null}
                                            onDrop={(position) => {
                                                const draggedTabId = draggedTab?.id;
                                                if (draggedTabId) {
                                                    handleDropZoneDrop(draggedTabId, position);
                                                }
                                            }}
                                        >
                                            <div className="h-full" />
                                        </DoubleSplitOverlay>
                                    )}
                                    {splitMode === 'double' && (
                                        <TripleSplitOverlay
                                            isDragActive={isDragActive}
                                            activeDropZone={activeDropZone as 'left' | 'center' | 'right' | null}
                                            onDrop={(position) => {
                                                const draggedTabId = draggedTab?.id;
                                                if (draggedTabId) {
                                                    handleDropZoneDrop(draggedTabId, position);
                                                }
                                            }}
                                        >
                                            <div className="h-full" />
                                        </TripleSplitOverlay>
                                    )}
                                </>
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
