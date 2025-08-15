"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from 'react-resizable-panels';
import TabBar from './tab-bar';
import { SplitModeSelect } from './split-mode-select';
import type { SplitMode, TabArea, TabAreas } from '../model/types';

interface ResizablePanelGroupProps {
    splitMode: SplitMode;
    isDragActive: boolean;
    tabAreas: TabAreas;
    activeTabsByArea: Record<TabArea, string | null>;
    onTabChange: (tabId: string, area: TabArea) => void;
    onTabClose: (tabId: string) => void;
    onSplitModeChange?: (mode: SplitMode) => void;
    renderAreaContent: (area: TabArea) => React.ReactNode;
    ExpandedDropZone: React.ComponentType<{ area: TabArea }>;
    moveTabToArea?: (tabId: string, fromArea: TabArea, toArea: TabArea) => void;
    getTabsForArea?: (area: TabArea) => Array<{ id: string; label: string; href?: string; menuNo?: string; view?: React.ComponentType }>;
}

// 빈 헤더 드롭존 컴포넌트
function EmptyHeaderDropZone({ area }: { area: TabArea }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `header-dropzone-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`h-12 w-full flex items-center px-3 text-sm transition-all duration-200 relative ${
                isOver 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
        >
            {/* 드롭 상태일 때 전체 영역 강조 */}
            {isOver && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-sm animate-pulse" />
            )}
            
            <div className="flex items-center gap-2 relative z-10">
                {isOver && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                )}
                <span className="font-medium">
                    {area === 'left' ? '왼쪽 영역' : area === 'center' ? '가운데 영역' : '오른쪽 영역'}
                    {isOver && ' - 탭을 드롭하세요'}
                </span>
            </div>
        </div>
    );
}

// 개별 패널 컴포넌트 (탭바 + 콘텐츠)
function IntegratedPanel({
    area,
    isDragActive,
    tabAreas,
    activeTabsByArea,
    onTabChange,
    onTabClose,
    renderAreaContent,
    ExpandedDropZone,
    showCloseButton = false,
    onClosePanel
}: {
    area: TabArea;
    isDragActive: boolean;
    tabAreas: TabAreas;
    activeTabsByArea: Record<TabArea, string | null>;
    onTabChange: (tabId: string, area: TabArea) => void;
    onTabClose: (tabId: string) => void;
    renderAreaContent: (area: TabArea) => React.ReactNode;
    ExpandedDropZone: React.ComponentType<{ area: TabArea }>;
    showCloseButton?: boolean;
    onClosePanel?: () => void;
}) {
    const areaTabs = tabAreas[area] || [];
    const activeTab = activeTabsByArea[area];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* 탭바 또는 빈 헤더 */}
            <div className="flex-shrink-0 border-b border-gray-200 relative">
                {areaTabs.length > 0 ? (
                    <TabBar
                        tabs={areaTabs}
                        activeTab={activeTab}
                        onTabChange={(tabId) => onTabChange(tabId, area)}
                        onTabClose={onTabClose}
                        area={area}
                    />
                ) : (
                    /* 빈 헤더 드롭존 */
                    <EmptyHeaderDropZone area={area} />
                )}

                {/* 분할 해제 버튼 */}
                {showCloseButton && onClosePanel && (
                    <button
                        onClick={onClosePanel}
                        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center 
                                 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 
                                 transition-colors duration-200 text-sm font-bold"
                        title="분할 해제"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="flex-1 min-h-0">
                {isDragActive ? (
                    <ExpandedDropZone area={area} />
                ) : (
                    renderAreaContent(area)
                )}
            </div>
        </div>
    );
}

export default function ResizablePanelGroup({
    splitMode,
    isDragActive,
    tabAreas,
    activeTabsByArea,
    onTabChange,
    onTabClose,
    onSplitModeChange,
    renderAreaContent,
    ExpandedDropZone,
    moveTabToArea,
    getTabsForArea
}: ResizablePanelGroupProps) {
    // 리사이즈 핸들 스타일
    const resizeHandleStyle = "w-1 bg-gray-300 hover:bg-blue-400 transition-colors duration-200 cursor-col-resize";

    // 분할 해제 함수
    const handleCloseSplit = () => {
        // 다른 영역의 탭들을 left 영역으로 이동
        if (moveTabToArea && getTabsForArea) {
            // right 영역의 탭들을 left로 이동
            const rightTabs = getTabsForArea('right');
            rightTabs.forEach(tab => {
                moveTabToArea(tab.id, 'right', 'left');
            });

            // center 영역의 탭들을 left로 이동 (triple 모드인 경우)
            if (splitMode === 'triple') {
                const centerTabs = getTabsForArea('center');
                centerTabs.forEach(tab => {
                    moveTabToArea(tab.id, 'center', 'left');
                });
            }
        }

        // splitMode를 single로 변경
        if (onSplitModeChange) {
            onSplitModeChange('single');
        }
    };

    // 분할 모드 선택 컴포넌트
    const SplitModeControl = () => (
        onSplitModeChange && (
            <div className="absolute top-2 right-2 z-10">
                <SplitModeSelect
                    currentMode={splitMode}
                    onModeChange={onSplitModeChange}
                    size="compact"
                />
            </div>
        )
    );

    if (splitMode === 'single') {
        return (
            <div className="h-full w-full relative">
                <SplitModeControl />
                <IntegratedPanel
                    area="left"
                    isDragActive={isDragActive}
                    tabAreas={tabAreas}
                    activeTabsByArea={activeTabsByArea}
                    onTabChange={onTabChange}
                    onTabClose={onTabClose}
                    renderAreaContent={renderAreaContent}
                    ExpandedDropZone={ExpandedDropZone}
                />
            </div>
        );
    }

    if (splitMode === 'double') {
        return (
            <div className="h-full relative">
                <SplitModeControl />
                <PanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel */}
                    <Panel
                        defaultSize={50}
                        minSize={20}
                        className="border-r border-gray-200"
                    >
                        <IntegratedPanel
                            area="left"
                            isDragActive={isDragActive}
                            tabAreas={tabAreas}
                            activeTabsByArea={activeTabsByArea}
                            onTabChange={onTabChange}
                            onTabClose={onTabClose}
                            renderAreaContent={renderAreaContent}
                            ExpandedDropZone={ExpandedDropZone}
                            showCloseButton={true}
                            onClosePanel={handleCloseSplit}
                        />
                    </Panel>

                    {/* Resize Handle */}
                    <PanelResizeHandle className={resizeHandleStyle} />

                    {/* Right Panel */}
                    <Panel
                        defaultSize={50}
                        minSize={20}
                    >
                        <IntegratedPanel
                            area="right"
                            isDragActive={isDragActive}
                            tabAreas={tabAreas}
                            activeTabsByArea={activeTabsByArea}
                            onTabChange={onTabChange}
                            onTabClose={onTabClose}
                            renderAreaContent={renderAreaContent}
                            ExpandedDropZone={ExpandedDropZone}
                            showCloseButton={true}
                            onClosePanel={handleCloseSplit}
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }

    if (splitMode === 'triple') {
        return (
            <div className="h-full relative">
                <SplitModeControl />
                <PanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel */}
                    <Panel
                        defaultSize={33.33}
                        minSize={15}
                        className="border-r border-gray-200"
                    >
                        <IntegratedPanel
                            area="left"
                            isDragActive={isDragActive}
                            tabAreas={tabAreas}
                            activeTabsByArea={activeTabsByArea}
                            onTabChange={onTabChange}
                            onTabClose={onTabClose}
                            renderAreaContent={renderAreaContent}
                            ExpandedDropZone={ExpandedDropZone}
                            showCloseButton={true}
                            onClosePanel={handleCloseSplit}
                        />
                    </Panel>

                    {/* First Resize Handle */}
                    <PanelResizeHandle className={resizeHandleStyle} />

                    {/* Center Panel */}
                    <Panel
                        defaultSize={33.34}
                        minSize={15}
                        className="border-r border-gray-200"
                    >
                        <IntegratedPanel
                            area="center"
                            isDragActive={isDragActive}
                            tabAreas={tabAreas}
                            activeTabsByArea={activeTabsByArea}
                            onTabChange={onTabChange}
                            onTabClose={onTabClose}
                            renderAreaContent={renderAreaContent}
                            ExpandedDropZone={ExpandedDropZone}
                            showCloseButton={true}
                            onClosePanel={handleCloseSplit}
                        />
                    </Panel>

                    {/* Second Resize Handle */}
                    <PanelResizeHandle className={resizeHandleStyle} />

                    {/* Right Panel */}
                    <Panel
                        defaultSize={33.33}
                        minSize={15}
                    >
                        <IntegratedPanel
                            area="right"
                            isDragActive={isDragActive}
                            tabAreas={tabAreas}
                            activeTabsByArea={activeTabsByArea}
                            onTabChange={onTabChange}
                            onTabClose={onTabClose}
                            renderAreaContent={renderAreaContent}
                            ExpandedDropZone={ExpandedDropZone}
                            showCloseButton={true}
                            onClosePanel={handleCloseSplit}
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }

    return null;
}
