/**
 * @fileoverview 다중 영역 탭 그룹 컴포넌트 (수정된 버전)
 * @description 1/2/3단 분할을 지원하는 탭 그룹 컨테이너
 */

"use client";

import React from 'react';
import TabBar from './tab-bar';
import type { TabAreas, TabArea, SplitMode } from '../model/types';
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
    className?: string;
}

export default function TabGroup({
    splitMode,
    areas,
    activeTabByArea,
    onTabChange,
    onTabClose,
    onTabReorder,
    onTabMove,
    onDropZoneDrop,
    onDragStateChange,
    onSplitModeChange,
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
        return activeTabByArea?.[area] || null;
    };
    const visibleAreas = getVisibleAreas();
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
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-1 ml-4">
                {(['single', 'double', 'triple'] as SplitMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => onSplitModeChange?.(mode)}
                        className={`w-6 h-6 text-xs rounded border transition-colors flex items-center justify-center ${splitMode === mode
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                            }`}
                        title={`${mode === 'single' ? '1단' : mode === 'double' ? '2단' : '3단'} 분할`}
                    >
                        {mode === 'single' ? '1' : mode === 'double' ? '2' : '3'}
                    </button>
                ))}
            </div>
        </div>
    );
}
