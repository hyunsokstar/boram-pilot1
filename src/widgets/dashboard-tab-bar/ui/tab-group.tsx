/**
 * @fileoverview 다중 영역 탭 그룹 컴포넌트 (수정된 버전)
 * @description 1/2/3단 분할을 지원하는 탭 그룹 컨테이너
 */

"use client";

import React from 'react';
import TabBar from './tab-bar';
import { Layout, Columns2, Columns3 } from 'lucide-react';
import type { TabAreas, TabArea, SplitMode } from '../model/types';
import { SplitModeSelect } from './split-mode-select';
export type { DropPosition } from './drop-zone-overlay';

export interface TabGroupProps {
    splitMode: SplitMode;
    areas: TabAreas;
    activeTabId?: string | null;
    activeTabByArea?: Record<TabArea, string | null>;
    onTabChange?: (tabId: string, area: TabArea) => void;
    onTabClose?: (tabId: string) => void;
    onTabReorder?: (sourceIndex: number, destinationIndex: number, area: TabArea) => void;
    onTabMove?: (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => void;
    onDropZoneDrop?: (tabId: string, position: 'left' | 'center' | 'right') => void;
    onDragStateChange?: (isDragActive: boolean, activeDropZone: 'left' | 'center' | 'right' | null) => void;
    onSplitModeChange?: (mode: SplitMode) => void;
    onAreaClose?: (area: TabArea) => void;
    className?: string;
}

export default function TabGroup({
    splitMode,
    areas,
    activeTabByArea,
    onTabChange,
    onTabClose,
    onTabReorder,
    // onTabMove, // 현재 사용되지 않음
    // onDropZoneDrop, // 현재 사용되지 않음
    // onDragStateChange, // 현재 사용되지 않음
    onSplitModeChange,
    onAreaClose,
    className = ""
}: TabGroupProps) {
    const getGridClass = () => {
        switch (splitMode) {
            case 'single': return 'grid-cols-1';
            case 'double': return 'grid-cols-2';
            case 'triple': return 'grid-cols-3';
            default: return 'grid-cols-1';
        }
    };
    const getVisibleAreas = (): TabArea[] => {
        switch (splitMode) {
            case 'single': return ['left'];
            case 'double': return ['left', 'right'];
            case 'triple': return ['left', 'center', 'right'];
            default: return ['left'];
        }
    };
    const getActiveTabForArea = (area: TabArea): string | null => {
        const activeTab = activeTabByArea?.[area] || null;
        console.log(`TabGroup - getActiveTabForArea(${area}):`, activeTab);
        return activeTab;
    };
    const visibleAreas = getVisibleAreas();
    console.log('TabGroup 렌더링:', { splitMode, visibleAreas, activeTabByArea });
    return (
        <div className={`flex items-center justify-between ${className}`} style={{
            overflow: 'visible',
            position: 'relative',
            zIndex: 1
        }}>
            <div className="flex-1 min-w-0" style={{
                overflow: 'visible',
                position: 'relative'
            }}>
                <div className={`grid ${getGridClass()} gap-1`} style={{
                    overflow: 'visible',
                    position: 'relative'
                }}>
                    {visibleAreas.map((area) => (
                        <div
                            key={area}
                            className="min-w-0"
                            style={{
                                overflow: 'visible',
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            <TabBar
                                tabs={areas[area]}
                                activeTab={getActiveTabForArea(area)}
                                onTabChange={(tabId) => onTabChange?.(tabId, area)}
                                onTabClose={onTabClose}
                                onTabReorder={(sourceIndex, destinationIndex) => onTabReorder?.(sourceIndex, destinationIndex, area)}
                                area={area}
                                onAreaClose={onAreaClose}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 분할 모드 선택 컴포넌트 */}
            <div className="flex items-center ml-4">
                <SplitModeSelect
                    currentMode={splitMode}
                    onModeChange={onSplitModeChange || (() => { })}
                    size="compact"
                    panelWidth="w-24"
                    placement="bottom-right"
                    showLabel={false}
                />
            </div>
        </div>
    );
}
