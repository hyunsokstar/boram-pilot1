"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from 'react-resizable-panels';
import TabBar from './tab-bar';
import type { SplitMode, TabArea, TabAreas } from '../model/types';
import { useTabStore } from '../model/tabStore';
import { Minus } from 'lucide-react';

// 메인 콘텐츠 분할 드롭존 (1영역일 때만 사용)
function MainContentSplitZone({ children }: { children: React.ReactNode }) {
    const splitMode = useTabStore((state) => state.splitMode);

    const { setNodeRef, isOver } = useDroppable({
        id: 'main-content-split',
        data: {
            type: 'main-content-split',
        },
    });

    // 디버깅용 로그
    if (isOver) {
        console.log('🟢 MainContentSplitZone 활성화됨');
    }

    // 1영역일 때만 드롭존 활성화
    if (splitMode !== 'single') {
        return <>{children}</>;
    }

    return (
        <div className="h-full relative">
            {/* 전체 영역을 덮는 드롭존 */}
            <div
                ref={setNodeRef}
                className="absolute inset-0 w-full h-full z-[9999]"
                style={{
                    minHeight: '100%',
                    minWidth: '100%',
                    pointerEvents: 'auto'
                }}
                onMouseEnter={() => console.log('🎯 MainContentSplitZone 마우스 진입')}
                onMouseLeave={() => console.log('🎯 MainContentSplitZone 마우스 나감')}
            />

            {/* 실제 콘텐츠 */}
            <div className="relative z-0" style={{ pointerEvents: 'none' }}>
                {children}
            </div>            {/* 드롭 오버레이 - pointer-events-none으로 설정하여 드래그 방해 방지 */}
            {isOver && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                    <div
                        className="absolute inset-0 bg-green-100/90 border-4 border-dashed border-green-500 rounded-lg"
                        style={{
                            borderColor: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.25)',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl animate-bounce">
                            <div className="flex items-center gap-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <span className="font-bold text-lg">2영역으로 분할</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

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
function EmptyHeaderDropZone({ area, onAreaClose }: { area: TabArea; onAreaClose?: (area: TabArea) => void }) {
    const splitMode = useTabStore((state) => state.splitMode);

    // 1영역일 때는 드롭존 비활성화
    const isDropZoneEnabled = splitMode !== 'single';

    const { setNodeRef, isOver } = useDroppable({
        id: `header-dropzone-${area}`,
        data: {
            type: 'tab-area',
            area: area,
        },
        disabled: !isDropZoneEnabled,
    });

    // 영역 닫기 핸들러
    const handleAreaClose = () => {
        if (onAreaClose) {
            onAreaClose(area);
        }
    };

    return (
        <div
            ref={isDropZoneEnabled ? setNodeRef : undefined}
            className={`h-12 w-full flex items-center justify-between px-3 text-sm transition-all duration-200 relative ${isOver && isDropZoneEnabled
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
        >
            {/* 드롭 상태일 때 전체 영역 강조 */}
            {isOver && isDropZoneEnabled && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-sm animate-pulse" />
            )}

            {/* 왼쪽: 영역 정보 */}
            <div className="flex items-center gap-2 relative z-10">
                {isOver && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                )}
                <span className="font-medium">
                    {area === 'left' ? '왼쪽 영역' : area === 'center' ? '가운데 영역' : '오른쪽 영역'}
                    {isOver && ' - 탭을 드롭하세요'}
                </span>
            </div>

            {/* 오른쪽: 닫기 버튼 */}
            {onAreaClose && (
                <div className="flex-shrink-0 relative z-10">
                    <button
                        onClick={handleAreaClose}
                        className="w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-red-50 hover:border-red-200 border border-gray-200 transition-all duration-200"
                        title="영역 닫기"
                    >
                        <Minus className="w-3.5 h-3.5 text-gray-600 hover:text-red-600 transition-colors duration-200" />
                    </button>
                </div>
            )}
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
    onAreaClose,
    onSplit,
}: {
    area: TabArea;
    isDragActive: boolean;
    tabAreas: TabAreas;
    activeTabsByArea: Record<TabArea, string | null>;
    onTabChange: (tabId: string, area: TabArea) => void;
    onTabClose: (tabId: string) => void;
    renderAreaContent: (area: TabArea) => React.ReactNode;
    ExpandedDropZone: React.ComponentType<{ area: TabArea }>;
    onAreaClose?: (area: TabArea) => void;
    onSplit?: () => void;
}) {
    const splitMode = useTabStore((state) => state.splitMode);
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
                        onAreaClose={onAreaClose}
                        onSplit={onSplit}
                    />
                ) : (
                    /* 빈 헤더 드롭존 */
                    <EmptyHeaderDropZone area={area} onAreaClose={onAreaClose} />
                )}
            </div>

            {/* 콘텐츠 영역 - 전체 높이 확보 */}
            <div className="flex-1 min-h-0 h-full">
                <MainContentSplitZone>
                    {/* 1영역 모드에서는 ExpandedDropZone 사용하지 않음 (MainContentSplitZone과 충돌 방지) */}
                    {isDragActive && splitMode !== 'single' ? (
                        <ExpandedDropZone area={area} />
                    ) : (
                        renderAreaContent(area)
                    )}
                </MainContentSplitZone>
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

    // 특정 영역 닫기 함수
    const handleAreaClose = (closingArea: TabArea) => {
        if (moveTabToArea && getTabsForArea) {
            // 닫히는 영역의 탭들을 left 영역으로 이동
            const tabsToMove = getTabsForArea(closingArea);
            tabsToMove.forEach(tab => {
                moveTabToArea(tab.id, closingArea, 'left');
            });

            // 분할 모드 변경
            if (onSplitModeChange) {
                if (splitMode === 'triple') {
                    // triple에서 하나 닫으면 double로
                    onSplitModeChange('double');
                } else if (splitMode === 'double') {
                    // double에서 하나 닫으면 single로
                    onSplitModeChange('single');
                }
            }
        }
    };

    // 2단 분할 함수
    const handleSplit = () => {
        if (onSplitModeChange && splitMode === 'single') {
            onSplitModeChange('double');
        }
    };

    // 렌더링 시작

    // 분할 모드 선택 컴포넌트
    /* 
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
    */

    if (splitMode === 'single') {
        return (
            <div className="h-full w-full relative">
                {/* <SplitModeControl /> */}
                <IntegratedPanel
                    area="left"
                    isDragActive={isDragActive}
                    tabAreas={tabAreas}
                    activeTabsByArea={activeTabsByArea}
                    onTabChange={onTabChange}
                    onTabClose={onTabClose}
                    renderAreaContent={renderAreaContent}
                    ExpandedDropZone={ExpandedDropZone}
                    onSplit={handleSplit}
                />
            </div>
        );
    }

    if (splitMode === 'double') {
        return (
            <div className="h-full relative">
                {/* <SplitModeControl /> */}
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
                            onAreaClose={() => handleAreaClose('left')}
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
                            onAreaClose={() => handleAreaClose('right')}
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }

    if (splitMode === 'triple') {
        return (
            <div className="h-full relative">
                {/* <SplitModeControl /> */}
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
                            onAreaClose={() => handleAreaClose('left')}
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
                            onAreaClose={() => handleAreaClose('center')}
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
                            onAreaClose={() => handleAreaClose('right')}
                        />
                    </Panel>
                </PanelGroup>
            </div>
        );
    }

    return null;
}
