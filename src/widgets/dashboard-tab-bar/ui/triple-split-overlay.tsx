/**
 * @fileoverview 3단 분할용 드롭존 오버레이 컴포넌트
 * @description 2단 → 3단 분할을 위한 전용 오버레이
 */

"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

/**
 * 3단 드롭존 위치 타입
 */
export type TripleSplitPosition = 'left' | 'center' | 'right';

/**
 * 3단 드롭존 컴포넌트의 Props
 */
interface TripleSplitZoneProps {
    /** 드롭존 위치 */
    position: TripleSplitPosition;
    /** 드래그 중인지 여부 */
    isDragActive: boolean;
    /** 드롭존 위에 호버 중인지 여부 */
    isOver?: boolean;
}

/**
 * 3단 개별 드롭존 컴포넌트
 */
function TripleSplitZone({ position, isDragActive, isOver = false }: TripleSplitZoneProps) {
    const { setNodeRef } = useDroppable({
        id: `triple-dropzone-${position}`,
        data: {
            type: 'dropzone',
            position: position,
        },
    });

    if (!isDragActive) return null;

    const getPositionStyles = () => {
        switch (position) {
            case 'left':
                return 'left-0 top-0 w-1/3 h-full';
            case 'center':
                return 'left-1/3 top-0 w-1/3 h-full';
            case 'right':
                return 'right-0 top-0 w-1/3 h-full';
            default:
                return 'inset-0';
        }
    };

    const getLabel = () => {
        switch (position) {
            case 'left':
                return '왼쪽 영역';
            case 'center':
                return '가운데 영역';
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
                transition-all duration-200
                ${isOver
                    ? 'bg-blue-100/40 backdrop-blur-sm border-2 border-dashed border-blue-500'
                    : 'bg-transparent'
                }
            `}
        >
            {/* 호버 시에만 표시되는 드롭 인디케이터 */}
            {isOver && (
                <>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium text-sm shadow-lg scale-105">
                            {getLabel()}
                        </div>
                    </div>
                    
                    {/* 전체 영역이 드롭존임을 시각적으로 표시 */}
                    <div className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/20" />
                </>
            )}
        </div>
    );
}

/**
 * 3단 분할 드롭존 오버레이 컴포넌트의 Props
 */
export interface TripleSplitOverlayProps {
    /** 드래그가 활성화되었는지 여부 */
    isDragActive: boolean;
    /** 현재 호버된 드롭존 위치 */
    activeDropZone?: TripleSplitPosition | null;
    /** 드롭 핸들러 */
    onDrop?: (position: TripleSplitPosition) => void;
    /** 오버레이가 적용될 컨테이너 클래스 */
    className?: string;
    /** 자식 컴포넌트 (본문 내용) */
    children: React.ReactNode;
}

/**
 * 3단 분할 드롭존 오버레이 컴포넌트
 * 
 * @description
 * - 2단에서 3단으로 분할할 때 사용
 * - 좌중우 3분할 가이드라인과 드롭존 제공
 * - 명확한 3분할 시각적 피드백
 * 
 * @example
 * ```tsx
 * <TripleSplitOverlay
 *   isDragActive={isDragging}
 *   activeDropZone={hoveredZone}
 *   onDrop={handleDrop}
 * >
 *   <div>본문 내용</div>
 * </TripleSplitOverlay>
 * ```
 */
export default function TripleSplitOverlay({
    isDragActive,
    activeDropZone = null,
    onDrop, // eslint-disable-line @typescript-eslint/no-unused-vars
    className = "",
    children
}: TripleSplitOverlayProps) {
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

                    {/* 3분할 가이드 라인 */}
                    <div className="absolute inset-0">
                        {/* 1/3 지점 세로 구분선 */}
                        <div className="absolute left-1/3 top-0 h-full w-0.5 bg-blue-400/70 shadow-sm" />
                        {/* 2/3 지점 세로 구분선 */}
                        <div className="absolute right-1/3 top-0 h-full w-0.5 bg-blue-400/70 shadow-sm" />
                    </div>

                    {/* 드롭존들 */}
                    <div className="absolute inset-0 pointer-events-auto">
                        <TripleSplitZone
                            position="left"
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'left'}
                        />
                        <TripleSplitZone
                            position="center"
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'center'}
                        />
                        <TripleSplitZone
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
