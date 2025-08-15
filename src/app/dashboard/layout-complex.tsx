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
import type { TabAreas, SplitMode, DropPosition, TabArea } from "@/widgets/dashboard-tab-bar";
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
        activeTabId,
        activeTabsByArea,
        addTab,
        removeTab,
        moveTab,
        reorderTabsInArea,
        setActiveTab,
        setActiveTabByArea,
        getTabsForArea,
        findTabById
    } = useTabStore();

    // 정렬된 탭 배열 가져오기
    const tabs = getSortedTabs();

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
                reorderTabsInArea(activeData.area as TabArea, draggedTabId, targetTabId);
            }
            return;
        }

        // 탭 영역으로 드래그 (확장된 드롭존 포함)
        if (over.data?.current?.type === 'tab-area') {
            const targetArea = over.data.current.area as TabArea;
            console.log('탭 영역으로 드래그:', { draggedTabId, targetArea });
            
            moveTab(draggedTabId, targetArea);
            return;
        }

        // 드롭존으로 드래그 처리
        handleDropZoneDrop(event);
    };

            // 같은 영역인지 확인
            if (activeData.area === targetData.area) {
                console.log('같은 영역 내 순서 변경 - SortableContext에 위임:', {
                    draggedTabId,
                    targetTabId,
                    area: activeData.area
                });

                // 같은 영역 내 순서 변경은 SortableContext가 자동으로 처리하도록 하고
                // 우리는 상태만 업데이트
                const area = activeData.area as TabArea;
                const areaItems = [...(currentTabAreas[area] || [])];
                const oldIndex = areaItems.findIndex(tab => tab && tab.id === draggedTabId);
                const newIndex = areaItems.findIndex(tab => tab && tab.id === targetTabId);

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    console.log('같은 영역 내 순서 변경:', { oldIndex, newIndex, area });

                    // 드래그 방향에 따른 정확한 삽입 위치 계산
                    const [movedTab] = areaItems.splice(oldIndex, 1);

                    // oldIndex 제거로 인한 newIndex 조정
                    let insertIndex = newIndex;
                    if (oldIndex < newIndex) {
                        // 오른쪽으로 이동: 제거로 인해 인덱스가 1 줄어들었으므로 조정
                        insertIndex = newIndex - 1;
                    }
                    // 왼쪽으로 이동하는 경우는 newIndex 그대로 사용

                    areaItems.splice(insertIndex, 0, movedTab);

                    console.log('순서 변경 결과:', {
                        from: oldIndex,
                        to: insertIndex,
                        direction: oldIndex < newIndex ? '오른쪽으로' : '왼쪽으로',
                        tabs: areaItems.map(t => t.label)
                    });

                    // 상태 업데이트
                    setTabAreas(prev => ({
                        ...prev,
                        [area]: areaItems
                    }));
                }
                return;
            }
        }

        // 드롭존에 드롭된 경우
        if (over.data?.current?.type === 'dropzone') {
            const position = over.data.current.position as DropPosition;
            console.log('드롭존에 드롭:', position, '탭:', draggedTabId);
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
        
        // position에 따라 splitMode 설정 및 탭 이동
        switch (position) {
            case 'left':
                setSplitMode('double');
                moveTab(tabId, 'left');
                break;
            case 'right':
                setSplitMode('double');
                moveTab(tabId, 'center');
                break;
            case 'center':
                setSplitMode('single');
                moveTab(tabId, 'left');
                break;
            case 'top-left':
                setSplitMode('triple');
                moveTab(tabId, 'left');
                break;
            case 'top-right':
                setSplitMode('triple');
                moveTab(tabId, 'center');
                break;
            case 'bottom':
                setSplitMode('triple');
                moveTab(tabId, 'right');
                break;
        }
    };

    // 탭 클릭 핸들러
    const handleTabChange = (tabId: string, area: TabArea) => {
        console.log('handleTabChange 호출:', { tabId, area, splitMode });

        const selectedTab = findTabById(tabId);
        if (!selectedTab) {
            console.log('선택된 탭을 찾을 수 없음:', tabId);
            return;
        }

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
        if (Comp) return <Comp />;

        // href가 없으면 기본 메시지 표시
        return (
            <div className="p-8 text-gray-400 text-center">
                <div className="text-lg font-medium text-gray-600 mb-2">{activeTab.label}</div>
                <div>이 탭에는 컨텐츠가 설정되지 않았습니다.</div>
            </div>
        );
    };

    // 탭 순서 변경 핸들러
    const handleTabReorder = (sourceIndex: number, destinationIndex: number, area: TabArea) => {
        console.log('handleTabReorder 호출:', { sourceIndex, destinationIndex, area });

        // 모든 경우에 영역별 관리 사용 (전역 reorderTabs 사용하지 않음)
        console.log('영역별 순서 변경 사용');
        setTabAreas(prev => {
            const newAreas = { ...prev };
            const areaItems = [...(newAreas[area] || [])];

            if (sourceIndex >= 0 && sourceIndex < areaItems.length &&
                destinationIndex >= 0 && destinationIndex < areaItems.length) {
                const [removed] = areaItems.splice(sourceIndex, 1);
                areaItems.splice(destinationIndex, 0, removed);
                newAreas[area] = areaItems;

                console.log('순서 변경 완료:', {
                    area,
                    oldOrder: prev[area]?.map(t => t.label),
                    newOrder: areaItems.map(t => t.label)
                });
            } else {
                console.log('잘못된 인덱스:', { sourceIndex, destinationIndex, length: areaItems.length });
            }

            return newAreas;
        });
    };

    // 탭을 다른 영역으로 이동
    const handleTabMove = (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => {
        console.log('handleTabMove 호출:', { tabId, fromArea, toArea, targetIndex });

        // 현재 스토어 상태 확인
        const wasActiveInFromArea = activeTabsByArea[fromArea] === tabId;

        setTabAreas(prev => {
            const newAreas = { ...prev };

            // 원본 영역에서 탭 제거
            const movingTab = (newAreas[fromArea] || []).find(tab => tab && tab.id === tabId);
            if (!movingTab) {
                console.log('이동할 탭을 찾을 수 없음:', tabId);
                return prev;
            }

            newAreas[fromArea] = (newAreas[fromArea] || []).filter(tab => tab && tab.id !== tabId);

            // 목표 영역에 탭 추가
            if (targetIndex !== undefined && targetIndex >= 0) {
                // 특정 위치에 삽입
                const targetAreaItems = [...(newAreas[toArea] || [])];
                targetAreaItems.splice(targetIndex, 0, movingTab);
                newAreas[toArea] = targetAreaItems;
                console.log('특정 위치에 탭 삽입:', { targetIndex, newLength: targetAreaItems.length });
            } else {
                // 마지막에 추가
                newAreas[toArea] = [...(newAreas[toArea] || []), movingTab];
                console.log('마지막에 탭 추가');
            }

            return newAreas;
        });

        // 스토어에 직접 설정
        setStoreActiveTabByArea(toArea, tabId);

        // 원래 영역에서 활성 탭이 이동된 경우 다른 탭으로 교체
        if (wasActiveInFromArea) {
            const remainingFromAreaTabs = (currentTabAreas[fromArea] || []).filter(tab => tab && tab.id !== tabId);
            const newActiveTab = remainingFromAreaTabs.length > 0 ? remainingFromAreaTabs[0].id : null;
            setStoreActiveTabByArea(fromArea, newActiveTab);
            console.log('원래 영역 활성 탭 교체:', { fromArea, newActiveTab });
        }

        // 전역 활성 탭도 설정
        setActiveTab(tabId);

        console.log('handleTabMove 완료: store 동기화됨', { toArea, tabId, wasActiveInFromArea });
    };

    // 탭을 특정 영역의 맨 끝으로 이동
    const handleTabMoveToEnd = (tabId: string, targetArea: TabArea) => {
        console.log('handleTabMoveToEnd 호출:', { tabId, targetArea });

        const allTabs = [...(currentTabAreas.left || []), ...(currentTabAreas.center || []), ...(currentTabAreas.right || [])];
        const tab = allTabs.find(t => t && t.id === tabId);
        if (!tab) {
            console.log('탭을 찾을 수 없음:', tabId);
            return;
        }

        // 현재 탭이 어느 영역에 있는지 찾기
        const currentArea = (currentTabAreas.left || []).find(t => t && t.id === tabId) ? 'left' :
            (currentTabAreas.center || []).find(t => t && t.id === tabId) ? 'center' : 'right';

        console.log('탭을 맨 끝으로 이동:', { from: currentArea, to: targetArea });

        // 같은 영역이면 맨 끝으로 이동
        if (currentArea === targetArea) {
            setTabAreas(prev => {
                const newAreas = { ...prev };
                const areaItems = [...(newAreas[currentArea] || [])];

                // 해당 탭을 제거하고 맨 끝에 추가
                const tabIndex = areaItems.findIndex(t => t && t.id === tabId);
                if (tabIndex !== -1) {
                    const [movedTab] = areaItems.splice(tabIndex, 1);
                    areaItems.push(movedTab); // 맨 끝에 추가
                    newAreas[currentArea] = areaItems;
                }

                return newAreas;
            });
        } else {
            // 다른 영역으로 이동하면서 맨 끝에 배치
            setTabAreas(prev => {
                const newAreas = { ...prev };
                // 원본 영역에서 탭 제거
                newAreas[currentArea] = (newAreas[currentArea] || []).filter(t => t && t.id !== tabId);
                // 목표 영역의 맨 끝에 탭 추가
                newAreas[targetArea] = [...(newAreas[targetArea] || []), tab];

                return newAreas;
            });

            // 분할 모드 자동 조정
            if (targetArea === 'center' && splitMode !== 'triple') {
                setSplitMode('triple');
            } else if ((targetArea === 'left' || targetArea === 'right') && splitMode === 'single') {
                setSplitMode('double');
            }

            // 이동된 탭을 해당 영역의 활성 탭으로 설정
            setStoreActiveTabByArea(targetArea, tabId);

            // 전역 활성 탭도 설정
            setActiveTab(tabId);
        }

        console.log('handleTabMoveToEnd 완료');
    };

    // 탭바 영역에 탭 드롭 핸들러 (빈 영역에 드롭할 때)
    const handleTabAreaDrop = (tabId: string, targetArea: TabArea) => {
        console.log('탭바 영역 드롭 처리:', { tabId, targetArea, currentSplitMode: splitMode });

        // 단계적 제한 검증
        if (targetArea === 'center') {
            if (splitMode === 'single') {
                console.log('1단 모드에서 center 영역 이동 차단');
                return; // 1단에서는 center로 이동 불가
            } else if (splitMode === 'double') {
                // 2단에서 center로 이동은 허용 (3단으로 전환)
                console.log('2단 → 3단 전환하여 center 영역으로 이동');
            }
        } else if (targetArea === 'right' && splitMode === 'single') {
            // 1단에서 right로 이동은 허용 (2단으로 전환)
            console.log('1단 → 2단 전환하여 right 영역으로 이동');
        }

        const allTabs = [...(currentTabAreas.left || []), ...(currentTabAreas.center || []), ...(currentTabAreas.right || [])];
        const tab = allTabs.find(t => t && t.id === tabId);
        if (!tab) {
            console.log('탭을 찾을 수 없음:', tabId);
            return;
        }

        // 현재 탭이 어느 영역에 있는지 찾기
        const currentArea = (currentTabAreas.left || []).find(t => t && t.id === tabId) ? 'left' :
            (currentTabAreas.center || []).find(t => t && t.id === tabId) ? 'center' : 'right';

        console.log('탭 영역 이동:', { from: currentArea, to: targetArea });

        // 같은 영역이면 순서 변경 없이 그냥 반환
        if (currentArea === targetArea) {
            console.log('같은 영역으로 드롭, 무시');
            return;
        }

        // 목표 영역에 따라 분할 모드 자동 조정 (단계별 제한)
        if (targetArea === 'center') {
            if (splitMode === 'double') {
                setSplitMode('triple');
            }
        } else if ((targetArea === 'left' || targetArea === 'right') && splitMode === 'single') {
            setSplitMode('double');
        }

        // 탭 이동
        setTabAreas(prev => {
            const newAreas = { ...prev };
            // 원본 영역에서 탭 제거
            newAreas[currentArea] = (newAreas[currentArea] || []).filter(t => t && t.id !== tabId);

            // 목표 영역의 마지막 order 값 계산
            const targetAreaTabs = newAreas[targetArea] || [];
            const maxOrder = targetAreaTabs.length > 0
                ? Math.max(...targetAreaTabs.map(t => t.order || 0))
                : -1;

            // 탭의 order 값을 업데이트하여 맨 뒤에 위치시킴
            const updatedTab = { ...tab, order: maxOrder + 1 };

            // 목표 영역에 탭 추가 (맨 뒤에 추가)
            newAreas[targetArea] = [...targetAreaTabs, updatedTab];

            console.log('탭 영역 업데이트 완료:', {
                탭: tab.label,
                원래영역: currentArea,
                목표영역: targetArea,
                새로운order: maxOrder + 1,
                영역탭수: newAreas[targetArea].length
            });

            return newAreas;
        });

        // Zustand 스토어의 탭 order도 비동기로 업데이트
        setTimeout(() => {
            const targetAreaTabs = currentTabAreas[targetArea] || [];
            const maxOrder = targetAreaTabs.length > 0
                ? Math.max(...targetAreaTabs.map(t => t.order || 0))
                : -1;
            updateTab(tabId, { order: maxOrder + 1 });
        }, 0);

        // 이동된 탭을 해당 영역의 활성 탭으로 설정
        setStoreActiveTabByArea(targetArea, tabId);

        // 전역 활성 탭도 설정
        setActiveTab(tabId);
    };

    // 드롭존에 탭 드롭 핸들러
    const handleDropZoneDrop = (tabId: string, position: DropPosition) => {
        console.log('드롭존 처리 시작:', { tabId, position, currentTabAreas });

        // 탭을 찾아서 현재 영역 확인
        const allTabs = [...(currentTabAreas.left || []), ...(currentTabAreas.center || []), ...(currentTabAreas.right || [])];
        const tab = allTabs.find(t => t && t.id === tabId);
        if (!tab) {
            console.log('탭을 찾을 수 없음:', tabId);
            return;
        }

        // 현재 탭이 어느 영역에 있는지 찾기
        const currentArea = (currentTabAreas.left || []).find(t => t && t.id === tabId) ? 'left' :
            (currentTabAreas.center || []).find(t => t && t.id === tabId) ? 'center' : 'right';

        console.log('현재 영역:', currentArea, '목표 위치:', position);

        // 분할 모드 자동 설정 (단계별 제한)
        let targetArea: TabArea;
        if (position === 'center') {
            if (splitMode === 'single') {
                console.log('1단 → 3단 직접 이동 방지, 2단으로 먼저 전환');
                setSplitMode('double');
                targetArea = 'right'; // center 대신 right로 이동
            } else if (splitMode === 'double') {
                setSplitMode('triple');
                targetArea = 'center';
            } else {
                targetArea = 'center';
            }
        } else {
            targetArea = position as TabArea;
            if ((position === 'left' || position === 'right') && splitMode === 'single') {
                setSplitMode('double');
            }
        }

        console.log('탭 이동:', { from: currentArea, to: targetArea });

        setTabAreas(prev => {
            const newAreas = { ...prev };
            // 원본 영역에서 탭 제거
            newAreas[currentArea] = (newAreas[currentArea] || []).filter(t => t && t.id !== tabId);

            // 목표 영역의 마지막 order 값 계산
            const targetAreaTabs = newAreas[targetArea] || [];
            const maxOrder = targetAreaTabs.length > 0
                ? Math.max(...targetAreaTabs.map(t => t.order || 0))
                : -1;

            // 탭의 order 값을 업데이트하여 맨 뒤에 위치시킴
            const updatedTab = { ...tab, order: maxOrder + 1 };

            // 목표 영역에 탭 추가 (마지막에 추가)
            newAreas[targetArea] = [...targetAreaTabs, updatedTab];

            console.log('드롭존 탭 영역 업데이트:', {
                탭: tab.label,
                원래영역: currentArea,
                목표영역: targetArea,
                새로운order: maxOrder + 1,
                영역탭수: newAreas[targetArea].length
            });

            return newAreas;
        });

        // Zustand 스토어의 탭 order도 비동기로 업데이트
        setTimeout(() => {
            const targetAreaTabs = currentTabAreas[targetArea] || [];
            const maxOrder = targetAreaTabs.length > 0
                ? Math.max(...targetAreaTabs.map(t => t.order || 0))
                : -1;
            updateTab(tabId, { order: maxOrder + 1 });
        }, 0);

        // 이동된 탭을 해당 영역의 활성 탭으로 설정
        setStoreActiveTabByArea(targetArea, tabId);

        // 전역 활성 탭도 설정
        setActiveTab(tabId);
        console.log('탭 활성화:', tabId);
    };

    // 분할 모드 변경 핸들러
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
        const allTabs = [
            ...(currentTabAreas.left || []),
            ...(currentTabAreas.center || []),
            ...(currentTabAreas.right || [])
        ].filter(tab => tab && tab.id);

        const currentIndex = allTabs.findIndex(tab => tab && tab.id === tabId);
        const isActiveTab = activeTabId === tabId;

        // 탭 삭제
        removeTab(tabId);

        // 영역별 상태에서도 제거
        setTabAreas(prev => ({
            left: (prev.left || []).filter(tab => tab && tab.id !== tabId),
            center: (prev.center || []).filter(tab => tab && tab.id !== tabId),
            right: (prev.right || []).filter(tab => tab && tab.id !== tabId)
        }));

        // 각 영역에서 해당 탭이 활성 탭이었다면 다른 탭으로 교체
        (['left', 'center', 'right'] as TabArea[]).forEach(area => {
            if (activeTabsByArea[area] === tabId) {
                // 해당 영역의 남은 탭들 확인
                const remainingAreaTabs = (currentTabAreas[area] || []).filter(tab => tab && tab.id !== tabId);
                const newActiveTab = remainingAreaTabs.length > 0 ? remainingAreaTabs[0].id : null;
                setStoreActiveTabByArea(area, newActiveTab);
            }
        });

        // 활성 탭 처리 (기존 로직 유지)
        if (isActiveTab) {
            const remainingTabs = allTabs.filter(tab => tab && tab.id !== tabId);
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
                            {/* 탭바 영역 - 확장된 드롭존 포함 */}
                            <div className="border-b border-gray-200 bg-white relative">
                                {/* 확장된 드롭존 영역 - 탭바 위쪽 공간도 포함 */}
                                <div className="relative">
                                    {/* 각 영역별 확장 드롭존 - 분할 모드에 따라 조건부 표시 */}
                                    {isDragActive && (
                                        <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-auto">
                                            {splitMode === 'single' ? (
                                                <div className="h-full grid grid-cols-2 gap-1">
                                                    {/* Left 영역 확장 드롭존 */}
                                                    <ExpandedDropZone area="left" />
                                                    {/* Right 영역 확장 드롭존 (1단에서는 right로 이동) */}
                                                    <ExpandedDropZone area="right" />
                                                </div>
                                            ) : splitMode === 'double' ? (
                                                <div className="h-full grid grid-cols-3 gap-1">
                                                    {/* Left 영역 확장 드롭존 */}
                                                    <ExpandedDropZone area="left" />
                                                    {/* Center 영역 확장 드롭존 */}
                                                    <ExpandedDropZone area="center" />
                                                    {/* Right 영역 확장 드롭존 */}
                                                    <ExpandedDropZone area="right" />
                                                </div>
                                            ) : (
                                                <div className="h-full grid grid-cols-3 gap-1">
                                                    {/* 3단 모드에서는 모든 영역 표시 */}
                                                    <ExpandedDropZone area="left" />
                                                    <ExpandedDropZone area="center" />
                                                    <ExpandedDropZone area="right" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="px-6">
                                        <TabGroup
                                            splitMode={splitMode}
                                            areas={currentTabAreas}
                                            activeTabByArea={activeTabsByArea}
                                            onTabChange={handleTabChange}
                                            onTabClose={handleTabClose}
                                            onTabReorder={handleTabReorder}
                                            onTabMove={handleTabMove}
                                            onDropZoneDrop={handleDropZoneDrop}
                                            onSplitModeChange={handleSplitModeChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 본문 영역 - 분할 모드에 따라 레이아웃 */}
                            {splitMode === 'single' ? (
                                <DoubleSplitOverlay
                                    isDragActive={isDragActive}
                                    activeDropZone={activeDropZone as 'left' | 'right' | null}
                                    onDrop={(position) => {
                                        const draggedTabId = draggedTab?.id;
                                        if (draggedTabId) {
                                            handleDropZoneDrop(draggedTabId, position as DropPosition);
                                        }
                                    }}
                                    className="flex-1 min-h-0"
                                >
                                    <div className="h-full grid grid-cols-1 gap-1" style={{ minHeight: '600px', maxHeight: 'calc(100vh - 200px)' }}>
                                        <div className="overflow-auto h-full">
                                            {renderAreaContent('left')}
                                        </div>
                                    </div>
                                </DoubleSplitOverlay>
                            ) : splitMode === 'double' ? (
                                <TripleSplitOverlay
                                    isDragActive={isDragActive}
                                    activeDropZone={activeDropZone as 'left' | 'center' | 'right' | null}
                                    onDrop={(position) => {
                                        const draggedTabId = draggedTab?.id;
                                        if (draggedTabId) {
                                            handleDropZoneDrop(draggedTabId, position as DropPosition);
                                        }
                                    }}
                                    className="flex-1 min-h-0"
                                >
                                    <div className="h-full grid grid-cols-2 gap-1" style={{ minHeight: '600px', maxHeight: 'calc(100vh - 200px)' }}>
                                        <div className="overflow-auto border-r h-full">
                                            {/* Left 영역 컨텐츠 */}
                                            {renderAreaContent('left')}
                                        </div>
                                        <div className="overflow-auto h-full">
                                            {/* Right 영역 컨텐츠 */}
                                            {renderAreaContent('right')}
                                        </div>
                                    </div>
                                </TripleSplitOverlay>
                            ) : (
                                <div className="flex-1 min-h-0">
                                    <div className="h-full grid grid-cols-3 gap-1" style={{ minHeight: '600px', maxHeight: 'calc(100vh - 200px)' }}>
                                        <div className="overflow-auto border-r h-full">
                                            {/* Left 영역 컨텐츠 */}
                                            {renderAreaContent('left')}
                                        </div>
                                        <div className="overflow-auto border-r h-full">
                                            {/* Center 영역 컨텐츠 */}
                                            {renderAreaContent('center')}
                                        </div>
                                        <div className="overflow-auto h-full">
                                            {/* Right 영역 컨텐츠 */}
                                            {renderAreaContent('right')}
                                        </div>
                                    </div>
                                </div>
                            )}

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
