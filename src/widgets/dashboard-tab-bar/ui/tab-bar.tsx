/**
 * @fileoverview 드래그 앤 드롭이 가능한 탭바 컴포넌트
 * @description dnd-kit을 사용하여 탭 순서 변경이 가능한 탭바
 */

"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableTab from './draggable-tab';
import type { TabArea } from '../model/types';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';

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
    // onTabReorder, // 현재 사용되지 않음
    area,
    onAreaClose,
    className = ""
}: TabBarProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // 탭바 영역을 드롭존으로 설정
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `tab-area-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
    });

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

            {/* 왼쪽 스크롤 버튼 */}
            {canScrollLeft && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 z-40 p-1.5 bg-white shadow-lg rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                    title="왼쪽으로 스크롤"
                >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
                </button>
            )}

            {/* 영역 닫기 버튼 */}
            {area && onAreaClose && (
                <button
                    onClick={handleAreaClose}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 z-40 p-1.5 bg-white shadow-lg rounded-full hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-200"
                    title="영역 닫기"
                >
                    <Minus className="w-3.5 h-3.5 text-gray-600 hover:text-red-600" />
                </button>
            )}

            <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
                {/* 탭 컨테이너 */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-1 h-full items-center overflow-x-auto scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        marginLeft: canScrollLeft ? '36px' : '8px',
                        marginRight: (area && onAreaClose) ? '36px' : (canScrollRight ? '36px' : '8px'),
                        paddingRight: canScrollRight ? '36px' : '0',
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
                </div>
            </SortableContext>

            {/* 오른쪽 스크롤 버튼 */}
            {canScrollRight && (
                <button
                    onClick={scrollRight}
                    className="absolute top-1/2 transform -translate-y-1/2 z-40 p-1.5 bg-white shadow-lg rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                    style={{ right: (area && onAreaClose) ? '44px' : '8px' }}
                    title="오른쪽으로 스크롤"
                >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
                </button>
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
