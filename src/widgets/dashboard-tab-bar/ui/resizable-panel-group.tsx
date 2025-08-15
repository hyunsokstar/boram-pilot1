"use client";

import React from 'react';
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
    ExpandedDropZone 
}: {
    area: TabArea;
    isDragActive: boolean;
    tabAreas: TabAreas;
    activeTabsByArea: Record<TabArea, string | null>;
    onTabChange: (tabId: string, area: TabArea) => void;
    onTabClose: (tabId: string) => void;
    renderAreaContent: (area: TabArea) => React.ReactNode;
    ExpandedDropZone: React.ComponentType<{ area: TabArea }>;
}) {
    const areaTabs = tabAreas[area] || [];
    const activeTab = activeTabsByArea[area];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* 탭바 */}
            {areaTabs.length > 0 && (
                <div className="flex-shrink-0 border-b border-gray-200">
                    <TabBar
                        tabs={areaTabs}
                        activeTab={activeTab}
                        onTabChange={(tabId) => onTabChange(tabId, area)}
                        onTabClose={onTabClose}
                        area={area}
                    />
                </div>
            )}
            
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
    ExpandedDropZone
}: ResizablePanelGroupProps) {
    // 리사이즈 핸들 스타일
    const resizeHandleStyle = "w-1 bg-gray-300 hover:bg-blue-400 transition-colors duration-200 cursor-col-resize";

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
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }

    return null;
}
