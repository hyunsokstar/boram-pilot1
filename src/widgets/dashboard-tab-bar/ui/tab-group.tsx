/**
 * @fileoverview 다중 영역 탭 그룹 컴포넌트
 * @description 1/2/3단 분할을 지원하는 탭 그룹 컨테이너
 */

"use client";

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
    restrictToHorizontalAxis,
    restrictToParentElement,
} from '@dnd-kit/modifiers';

import TabBar from './tab-bar';
import DraggableTab from './draggable-tab';
import type {
    DragEndEvent,
    TabAreas,
    TabArea,
    SplitMode,
    DynamicTab
} from '../model/types';

/**
 * 탭 그룹 컴포넌트의 Props
 */
export interface TabGroupProps {
    /** 현재 분할 모드 */
    splitMode: SplitMode;
    /** 각 영역별 탭들 */
    areas: TabAreas;
    /** 현재 활성화된 탭 ID */
    activeTabId?: string | null;
    /** 각 영역별 활성 탭 ID */
    activeTabByArea?: Record<TabArea, string | null>;
    /** 탭 클릭 핸들러 */
    onTabChange?: (tabId: string, area: TabArea) => void;
    /** 탭 닫기 핸들러 */
    onTabClose?: (tabId: string) => void;
    /** 같은 영역 내 탭 순서 변경 핸들러 */
    onTabReorder?: (sourceIndex: number, destinationIndex: number, area: TabArea) => void;
    /** 탭을 다른 영역으로 이동 핸들러 */
    onTabMove?: (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => void;
    /** 분할 모드 변경 핸들러 */
    onSplitModeChange?: (mode: SplitMode) => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 다중 영역 탭 그룹 컴포넌트
 * 
 * @description
 * - 1/2/3단 분할 모드 지원
 * - 영역 간 탭 드래그 앤 드롭
 * - 각 영역별 독립적인 탭바 관리
 * 
 * @example
 * ```tsx
 * <TabGroup
 *   splitMode="double"
 *   areas={tabAreas}
 *   activeTabId={activeTab}
 *   onTabChange={handleTabChange}
 *   onTabMove={handleTabMove}
 *   onSplitModeChange={handleSplitModeChange}
 * />
 * ```
 */
export default function TabGroup({
    splitMode,
    areas,
    activeTabByArea,
    onTabChange,
    onTabClose,
    onTabReorder,
    onTabMove,
    onSplitModeChange,
    className = ""
}: TabGroupProps) {
    const [activeTab, setActiveTab] = React.useState<DynamicTab | null>(null);

    // 드래그 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    /**
     * 탭이 어느 영역에 속하는지 찾기
     */
    const findTabArea = (tabId: string): TabArea | null => {
        if (areas.left.find(tab => tab.id === tabId)) return 'left';
        if (areas.center.find(tab => tab.id === tabId)) return 'center';
        if (areas.right.find(tab => tab.id === tabId)) return 'right';
        return null;
    };

    /**
     * 드래그 시작 핸들러
     */
    const handleDragStart = (event: { active: { id: string | number } }) => {
        const { active } = event;
        const tabId = String(active.id);
        
        // 드래그 중인 탭 찾기
        const area = findTabArea(tabId);
        if (area) {
            const tab = areas[area].find(t => t.id === tabId);
            setActiveTab(tab || null);
        }
    };    /**
     * 드래그 종료 핸들러
     */
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTab(null);

        if (!over || active.id === over.id) return;

        const draggedTabId = String(active.id);
        const targetTabId = String(over.id);

        // 드래그된 탭의 현재 영역
        const fromArea = findTabArea(draggedTabId);
        if (!fromArea) return;

        // 드롭 대상 탭의 영역 (over.data.current로 영역 정보 전달)
        const targetArea = over.data.current?.area as TabArea || findTabArea(targetTabId);
        if (!targetArea) return;

        // 같은 영역 내에서의 순서 변경
        if (fromArea === targetArea) {
            const areaItems = areas[fromArea];
            const oldIndex = areaItems.findIndex(tab => tab.id === draggedTabId);
            const newIndex = areaItems.findIndex(tab => tab.id === targetTabId);

            if (oldIndex !== -1 && newIndex !== -1) {
                onTabReorder?.(oldIndex, newIndex, fromArea);
            }
        }
        // 다른 영역으로 이동
        else {
            const targetAreaItems = areas[targetArea];
            const targetIndex = targetAreaItems.findIndex(tab => tab.id === targetTabId);

            onTabMove?.(draggedTabId, fromArea, targetArea, targetIndex);
        }
    };

    /**
     * 분할 모드에 따른 CSS 클래스 결정
     */
    const getGridClass = () => {
        switch (splitMode) {
            case 'single':
                return 'grid-cols-1';
            case 'double':
                return 'grid-cols-2';
            case 'triple':
                return 'grid-cols-3';
            default:
                return 'grid-cols-1';
        }
    };

    /**
     * 영역별 활성 탭 ID 가져오기
     */
    const getActiveTabForArea = (area: TabArea): string | null => {
        return activeTabByArea?.[area] || null;
    };

    /**
     * 표시할 영역들 결정
     */
    const getVisibleAreas = (): TabArea[] => {
        switch (splitMode) {
            case 'single':
                return ['left'];
            case 'double':
                return ['left', 'right'];
            case 'triple':
                return ['left', 'center', 'right'];
            default:
                return ['left'];
        }
    };

    const visibleAreas = getVisibleAreas();

    return (
        <div className={`flex flex-col ${className}`}>
            {/* 분할 모드 컨트롤 */}
            <div className="flex items-center gap-2 p-2 bg-gray-100 border-b">
                <span className="text-sm font-medium text-gray-700">분할 모드:</span>
                <div className="flex gap-1">
                    {(['single', 'double', 'triple'] as SplitMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onSplitModeChange?.(mode)}
                            className={`px-3 py-1 text-xs rounded border transition-colors ${splitMode === mode
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {mode === 'single' ? '1단' : mode === 'double' ? '2단' : '3단'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 탭 영역들 */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            >
                <div className={`grid ${getGridClass()} gap-1 min-h-0`}>
                    {visibleAreas.map((area) => (
                        <div key={area} className="min-w-0">
                            <TabBar
                                tabs={areas[area]}
                                activeTab={getActiveTabForArea(area)}
                                onTabChange={(tabId) => onTabChange?.(tabId, area)}
                                onTabClose={onTabClose}
                                area={area}
                                className="h-full"
                            />
                        </div>
                    ))}
                </div>

                {/* 드래그 오버레이 */}
                <DragOverlay>
                    {activeTab ? (
                        <DraggableTab
                            id={activeTab.id}
                            label={activeTab.label}
                            isActive={false}
                            isClosable={activeTab.isClosable}
                            onTabClick={() => { }}
                            onTabClose={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
