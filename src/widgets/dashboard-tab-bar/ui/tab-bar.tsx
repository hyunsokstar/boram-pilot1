/**
 * @fileoverview 드래그 앤 드롭이 가능한 탭바 컴포넌트
 * @description dnd-kit을 사용하여 탭 순서 변경이 가능한 탭바
 */

"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableTab from './draggable-tab';
import type { TabArea } from '../model/types';

/**
 * 탭바에서 사용하는 탭 아이템 타입
 */
export interface TabItem {
    id: string;
    label: string;
    href?: string;
    menuNo?: string;
    isClosable?: boolean;
    order?: number;
}

/**
 * 탭바 컴포넌트의 Props
 */
export interface TabBarProps {
    /** 표시할 탭들 */
    tabs: TabItem[];
    /** 현재 활성화된 탭 ID */
    activeTab?: string | null;
    /** 탭 클릭 핸들러 */
    onTabChange?: (tabId: string) => void;
    /** 탭 닫기 핸들러 */
    onTabClose?: (tabId: string) => void;
    /** 탭 순서 변경 핸들러 */
    onTabReorder?: (sourceIndex: number, destinationIndex: number) => void;
    /** 탭이 속한 영역 (TabGroup에서 사용) */
    area?: TabArea;
    /** 추가 CSS 클래스 */
    className?: string;
}

/**
 * 드래그 앤 드롭이 가능한 탭바 컴포넌트
 * 
 * @description
 * - dnd-kit을 사용한 드래그 앤 드롭 기능
 * - 수평 방향으로만 드래그 제한
 * - 키보드 접근성 지원
 * - 탭이 없을 때 안내 메시지 표시
 * 
 * @example
 * ```tsx
 * <TabBar
 *   tabs={tabs}
 *   activeTab={activeTabId}
 *   onTabChange={handleTabChange}
 *   onTabClose={handleTabClose}
 *   onTabReorder={handleTabReorder}
 * />
 * ```
 */
export default function TabBar({
    tabs,
    activeTab,
    onTabChange,
    onTabClose,
    onTabReorder,
    area,
    className = ""
}: TabBarProps) {
    // 탭바 영역을 드롭존으로 설정
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `tab-area-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
    });

    console.log('TabBar 렌더링:', { area, droppableId: `tab-area-${area}`, tabs: tabs.length, isOver });

    /**
     * 탭 클릭 핸들러
     */
    const handleTabClick = (tabId: string) => {
        onTabChange?.(tabId);
    };

    /**
     * 탭 닫기 핸들러
     */
    const handleCloseTab = (tabId: string) => {
        onTabClose?.(tabId);
    };

    // 탭 ID 배열 (SortableContext용)
    const tabIds = tabs.map(tab => tab.id);

    // 탭이 없는 경우 안내 메시지 표시 (드롭존은 유지)
    if (tabs.length === 0) {
        return (
            <div
                ref={setDropRef}
                className={`bg-gray-50 border-b border-gray-200 px-2 relative transition-all duration-200 ${className}`}
                style={{ overflow: 'visible', position: 'relative', height: '48px' }}
            >
                {/* 미니멀한 드롭 인디케이터 - 점선 테두리만 */}
                {isOver && (
                    <div className="absolute inset-0 z-30 pointer-events-none">
                        {/* 점선 테두리만 표시 */}
                        <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg animate-pulse" style={{
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
                        }} />

                        {/* 작은 드롭 아이콘 - 우상단에 표시 */}
                        <div className="absolute top-1 right-1">
                            <div className="bg-blue-500 text-white p-1 rounded-full shadow-md scale-110 animate-bounce">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`py-1 px-1 text-sm text-gray-500 relative z-20 flex items-center justify-center transition-opacity duration-200`} style={{ minHeight: '32px' }}>
                    헤더 메뉴를 클릭하여 탭을 추가하세요
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setDropRef}
            className={`bg-gray-50 border-b border-gray-200 px-2 relative transition-all duration-200 ${className}`}
            style={{ overflow: 'visible', position: 'relative', height: '48px' }}
        >
            {/* 미니멀한 드롭 인디케이터 - 점선 테두리만 */}
            {isOver && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                    {/* 점선 테두리만 표시 */}
                    <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg animate-pulse" style={{
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
                    }} />

                    {/* 작은 드롭 아이콘 - 우상단에 표시 */}
                    <div className="absolute top-1 right-1">
                        <div className="bg-blue-500 text-white p-1 rounded-full shadow-md scale-110 animate-bounce">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
                <nav
                    className="flex gap-1 relative z-20 h-full items-center"
                    aria-label="Tabs"
                    role="tablist"
                    style={{
                        overflow: 'visible',
                        position: 'relative'
                    }}
                >
                    {tabs.map((tab) => (
                        <DraggableTab
                            key={tab.id}
                            id={tab.id}
                            label={tab.label}
                            isActive={activeTab === tab.id}
                            isClosable={tab.isClosable}
                            onTabClick={handleTabClick}
                            onTabClose={handleCloseTab}
                            area={area}
                        />
                    ))}
                </nav>
            </SortableContext>
        </div>
    );
}
