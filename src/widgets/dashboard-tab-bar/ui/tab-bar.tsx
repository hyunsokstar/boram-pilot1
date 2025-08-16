/**
 * @fileoverview 드래그 앤 드롭이 가능한 탭바 컴포넌트
 * @description dnd-kit을 사용하여 탭 순서 변경이 가능한 탭바
 */

"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableTab from './draggable-tab';
import type { SplitMode, TabArea } from '../model/types';
import { ChevronLeft, ChevronRight, Minus, SplitSquareHorizontal } from 'lucide-react';
import { useTabStore } from '../model/tabStore';

// 탭 리스트 끝에 위치하는 드롭존 컴포넌트
function EndDropZone({ area }: { area?: TabArea }) {
    const splitMode = useTabStore((state) => state.splitMode);
    const isEndDropEnabled = splitMode !== 'single';

    const { setNodeRef, isOver } = useDroppable({
        id: `tab-end-${area}`,
        data: {
            type: 'tab-end',
            area: area,
        },
        disabled: !isEndDropEnabled,
    });

    // 디버깅용 로그
    if (isOver && isEndDropEnabled) {
        console.log('🟡 EndDropZone 활성화됨 (splitMode:', splitMode, ')');
    }

    return (
        <div
            ref={isEndDropEnabled ? setNodeRef : undefined}
            className={`
                flex-shrink-0 w-12 h-8 mx-2 transition-all duration-200 rounded
                ${isOver && isEndDropEnabled
                    ? 'bg-blue-100 border-2 border-dashed border-blue-400'
                    : 'bg-transparent border-2 border-dashed border-transparent hover:border-gray-300'
                }
            `}
        >
            {isOver && isEndDropEnabled && (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1 h-4 bg-blue-500 rounded"></div>
                </div>
            )}
        </div>
    );
}

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
    /** 영역 닫기 핸들러 */
    onAreaClose?: (area: TabArea) => void;
    /** 2단 분할 핸들러 */
    onSplit?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
    /** 드래그 활성화 상태 */
    isDragActive?: boolean;
    /** 분할 모드 */
    splitMode?: SplitMode;
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
    // onTabReorder, // 현재 사용되지 않음
    area,
    onAreaClose,
    onSplit,
    className = "",
    isDragActive,
    splitMode: propSplitMode
}: TabBarProps) {
    const splitModeFromStore = useTabStore((state) => state.splitMode);
    const splitMode = propSplitMode || splitModeFromStore;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // 탭바 영역을 드롭존으로 설정 (1영역일 때는 비활성화)
    const isTabBarDropEnabled = splitMode !== 'single';
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `tab-area-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
        disabled: !isTabBarDropEnabled,
    });

    // 디버깅용 로그
    if (isOver && isTabBarDropEnabled) {
        console.log('🔵 TabBar 드롭존 활성화됨 (splitMode:', splitMode, ')');
    }

    // 스크롤 상태 업데이트
    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    // 컴포넌트 마운트 및 탭 변경 시 스크롤 상태 업데이트
    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            return () => container.removeEventListener('scroll', updateScrollButtons);
        }
    }, [tabs]);

    // 왼쪽 스크롤
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    // 오른쪽 스크롤
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // 영역 닫기
    const handleAreaClose = () => {
        if (area && onAreaClose) {
            onAreaClose(area);
        }
    };

    console.log('TabBar 렌더링:', { area, droppableId: `tab-area-${area}`, tabs: tabs.length });

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

                        {/* 작은 드롭 아이콘 - 가운데에 표시 */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-blue-500 text-white p-2 rounded-full shadow-md scale-110 animate-bounce">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flex 기반 레이아웃 - 탭이 없을 때도 동일 구조 */}
                <div className="flex items-center h-full px-2 gap-2">
                    {/* 가운데 확장 - 안내 메시지 */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="py-1 px-1 text-sm text-gray-500 relative z-20">
                            헤더 메뉴를 클릭하여 탭을 추가하세요
                        </div>
                    </div>

                    {/* 오른쪽 컨트롤 */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                        {/* 영역 닫기 버튼 - 탭이 없어도 표시 */}
                        {area && onAreaClose && (
                            <button
                                onClick={handleAreaClose}
                                className="w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-red-50 hover:border-red-200 border border-gray-200 transition-all duration-200"
                                title="영역 닫기"
                            >
                                <Minus className="w-3.5 h-3.5 text-gray-600 hover:text-red-600 transition-colors duration-200" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={isTabBarDropEnabled ? setDropRef : undefined}
            className={`bg-gray-50 border-b border-gray-200 relative transition-all duration-200 ${className}`}
            style={{
                overflow: 'visible',
                position: 'relative',
                height: '48px',
                // 드래그 중이고 single 모드일 때 pointer-events 비활성화
                pointerEvents: (isDragActive && splitMode === 'single') ? 'none' : 'auto'
            }}
        >
            {/* 미니멀한 드롭 인디케이터 - 1영역일 때는 표시하지 않음 */}
            {isOver && isTabBarDropEnabled && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                    {/* 점선 테두리만 표시 */}
                    <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg animate-pulse" style={{
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
                    }} />

                    {/* 작은 드롭 아이콘 - 가운데에 표시 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-blue-500 text-white p-2 rounded-full shadow-md scale-110 animate-bounce">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Flex 기반 레이아웃 */}
            <div className="flex items-center h-full px-2 gap-2">
                {/* 왼쪽 컨트롤 */}
                <div className="flex-shrink-0">
                    {canScrollLeft && (
                        <button
                            onClick={scrollLeft}
                            className="w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                            title="왼쪽으로 스크롤"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                    )}
                </div>

                {/* 탭 컨테이너 - 가운데 확장 */}
                <div className="flex-1 min-w-0">
                    <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-2 h-full items-center overflow-x-auto scrollbar-hide"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {tabs.map((tab) => (
                                <DraggableTab
                                    key={tab.id}
                                    id={tab.id}
                                    label={tab.label}
                                    isActive={activeTab === tab.id}
                                    isClosable={area === 'center' ? true : tab.isClosable}
                                    onTabClick={handleTabClick}
                                    onTabClose={handleCloseTab}
                                    area={area}
                                    isDragActive={isDragActive}
                                    splitMode={splitMode}
                                />
                            ))}

                            {/* 맨 끝으로 이동할 수 있는 드롭존 */}
                            <EndDropZone area={area} />
                        </div>
                    </SortableContext>
                </div>

                {/* 오른쪽 컨트롤 */}
                <div className="flex-shrink-0 flex items-center gap-1">
                    {canScrollRight && (
                        <button
                            onClick={scrollRight}
                            className="w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                            title="오른쪽으로 스크롤"
                        >
                            <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                    )}

                    {/* 2단 분할 버튼 - 단일 모드일 때만 표시 */}
                    {splitMode === 'single' && onSplit && (
                        <button
                            onClick={onSplit}
                            className="w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all duration-200"
                            title="2단 분할"
                        >
                            <SplitSquareHorizontal className="w-3.5 h-3.5 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
                        </button>
                    )}

                    {/* 영역 닫기 버튼 - 탭 유무와 관계없이 표시 */}
                    {area && onAreaClose && (
                        <button
                            onClick={handleAreaClose}
                            className="w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-red-50 hover:border-red-200 border border-gray-200 transition-all duration-200"
                            title="영역 닫기"
                        >
                            <Minus className="w-3.5 h-3.5 text-gray-600 hover:text-red-600 transition-colors duration-200" />
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
