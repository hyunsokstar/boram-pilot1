/**
 * @fileoverview 드래그 앤 드롭이 가능한 탭바 컴포넌트
 * @description dnd-kit을 사용하여 탭 순서 변경이 가능한 탭바
 */

"use client";

import React from 'react';
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

    // 탭이 없는 경우 안내 메시지 표시
    if (tabs.length === 0) {
        return (
            <div className={`bg-gray-50 border-b border-gray-200 p-2 ${className}`}>
                <div className="py-4 px-1 text-sm text-gray-500">
                    헤더 메뉴를 클릭하여 탭을 추가하세요
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gray-50 border-b border-gray-200 p-2 ${className}`} style={{ overflow: 'visible', position: 'relative' }}>
            <nav
                className="flex gap-1"
                aria-label="Tabs"
                role="tablist"
                style={{ 
                    overflow: 'visible', 
                    position: 'relative',
                    zIndex: 1
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
        </div>
    );
}
