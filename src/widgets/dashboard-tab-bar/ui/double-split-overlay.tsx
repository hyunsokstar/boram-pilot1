/**
 * @fileoverview 2단 분할용 드롭존 오버레이 컴포넌트
 * @description 1단 → 2단 분할을 위한 전용 오버레이
 */

"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

/**
 * 2단 드롭존 위치 타입
 */
export type DoubleSplitPosition = 'left' | 'right';

/**
 * 2단 드롭존 컴포넌트의 Props
 */
interface DoubleSplitZoneProps {
    /** 드롭존 위치 */
    position: DoubleSplitPosition;
    /** 드래그 중인지 여부 */
    isDragActive: boolean;
    /** 드롭존 위에 호버 중인지 여부 */
    isOver?: boolean;
}

/**
 * 2단 개별 드롭존 컴포넌트
 */
function DoubleSplitZone({ position, isDragActive, isOver = false }: DoubleSplitZoneProps) {
    const { setNodeRef } = useDroppable({
        id: `double-dropzone-${position}`,
        data: {
            type: 'dropzone',
            position: position,
        },
    });

    if (!isDragActive) return null;

    const getPositionStyles = () => {
        switch (position) {
            case 'left':
                return 'left-0 top-0 w-1/2 h-full';
            case 'right':
                return 'right-0 top-0 w-1/2 h-full';
            default:
                return 'inset-0';
        }
    };

    const getLabel = () => {
        switch (position) {
            case 'left':
                return '왼쪽 영역';
            case 'right':
                return '오른쪽 영역';
            default:
                return '';
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                absolute ${getPositionStyles()} 
                border-2 border-dashed transition-all duration-200
                flex items-center justify-center
                ${isOver
                    ? 'border-blue-500 bg-blue-100/30 backdrop-blur-sm'
                    : 'border-gray-400 bg-gray-100/20'
                }
            `}
        >
            <div className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${isOver
                    ? 'bg-blue-500 text-white scale-105'
                    : 'bg-white/80 text-gray-700'
                }
            `}>
                {getLabel()}
            </div>
        </div>
    );
}

/**
 * 2단 분할 드롭존 오버레이 컴포넌트의 Props
 */
export interface DoubleSplitOverlayProps {
    /** 드래그가 활성화되었는지 여부 */
    isDragActive: boolean;
    /** 현재 호버된 드롭존 위치 */
    activeDropZone?: DoubleSplitPosition | null;
    /** 드롭 핸들러 */
    onDrop?: (position: DoubleSplitPosition) => void;
    /** 오버레이가 적용될 컨테이너 클래스 */
    className?: string;
    /** 자식 컴포넌트 (본문 내용) */
    children: React.ReactNode;
}

/**
 * 2단 분할 드롭존 오버레이 컴포넌트
 * 
 * @description
 * - 1단에서 2단으로 분할할 때 사용
 * - 좌우 2분할 가이드라인과 드롭존 제공
 * - 명확한 2분할 시각적 피드백
 * 
 * @example
 * ```tsx
 * <DoubleSplitOverlay
 *   isDragActive={isDragging}
 *   activeDropZone={hoveredZone}
 *   onDrop={handleDrop}
 * >
 *   <div>본문 내용</div>
 * </DoubleSplitOverlay>
 * ```
 */
export default function DoubleSplitOverlay({
    isDragActive,
    activeDropZone = null,
    onDrop, // eslint-disable-line @typescript-eslint/no-unused-vars
    className = "",
    children
}: DoubleSplitOverlayProps) {
    return (
        <div className={`relative ${className}`}>
            {/* 본문 내용 */}
            <div className={`transition-opacity duration-200 ${isDragActive ? 'opacity-80' : 'opacity-100'}`}>
                {children}
            </div>

            {/* 드롭존 오버레이 */}
            {isDragActive && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    {/* 배경 오버레이 */}
                    <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />

                    {/* 2분할 가이드 라인 */}
                    <div className="absolute inset-0">
                        {/* 중앙 세로 구분선 */}
                        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-blue-400/70 shadow-sm" />
                    </div>

                    {/* 드롭존들 */}
                    <div className="absolute inset-0 pointer-events-auto">
                        <DoubleSplitZone
                            position="left"
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'left'}
                        />
                        <DoubleSplitZone
                            position="right"
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'right'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
