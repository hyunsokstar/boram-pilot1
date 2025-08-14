/**
 * @fileoverview 드롭존 오버레이 컴포넌트
 * @description 탭을 본문 영역으로 드래그할 때 분할 가이드를 표시
 */

"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

/**
 * 드롭존 위치 타입
 */
export type DropPosition = 'left' | 'center' | 'right' | 'full';

/**
 * 드롭존 컴포넌트의 Props
 */
interface DropZoneProps {
    /** 드롭존 위치 */
    position: DropPosition;
    /** 드래그 중인지 여부 */
    isDragActive: boolean;
    /** 드롭존 위에 호버 중인지 여부 */
    isOver?: boolean;
    /** 드롭 핸들러 */
    onDrop?: (position: DropPosition) => void;
}

/**
 * 개별 드롭존 컴포넌트
 */
function DropZone({ position, isDragActive, isOver = false }: DropZoneProps) {
    const { setNodeRef } = useDroppable({
        id: `dropzone-${position}`,
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
            case 'full':
                return 'inset-0';
            default:
                return 'inset-0';
        }
    };

    const getLabel = () => {
        switch (position) {
            case 'left':
                return '왼쪽 분할';
            case 'center':
                return '가운데 분할';
            case 'right':
                return '오른쪽 분할';
            case 'full':
                return '전체 화면';
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
 * 드롭존 오버레이 컴포넌트의 Props
 */
export interface DropZoneOverlayProps {
    /** 드래그가 활성화되었는지 여부 */
    isDragActive: boolean;
    /** 현재 호버된 드롭존 위치 */
    activeDropZone?: DropPosition | null;
    /** 드롭 핸들러 */
    onDrop?: (position: DropPosition) => void;
    /** 오버레이가 적용될 컨테이너 클래스 */
    className?: string;
    /** 자식 컴포넌트 (본문 내용) */
    children: React.ReactNode;
}

/**
 * 드롭존 오버레이 컴포넌트
 * 
 * @description
 * - 탭 드래그 중에만 활성화
 * - 피그마 스타일의 분할 가이드 표시
 * - 드롭 위치에 따른 시각적 피드백
 * - 본문 내용 위에 오버레이로 표시
 * 
 * @example
 * ```tsx
 * <DropZoneOverlay
 *   isDragActive={isDragging}
 *   activeDropZone={hoveredZone}
 *   onDrop={handleDrop}
 * >
 *   <div>본문 내용</div>
 * </DropZoneOverlay>
 * ```
 */
export default function DropZoneOverlay({
    isDragActive,
    activeDropZone = null,
    onDrop,
    className = "",
    children
}: DropZoneOverlayProps) {
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
                    
                    {/* 분할 가이드 라인 */}
                    <div className="absolute inset-0">
                        {/* 세로 구분선들 */}
                        <div className="absolute left-1/3 top-0 h-full w-0.5 bg-blue-300/60" />
                        <div className="absolute right-1/3 top-0 h-full w-0.5 bg-blue-300/60" />
                    </div>

                    {/* 드롭존들 */}
                    <div className="absolute inset-0 pointer-events-auto">
                        <DropZone 
                            position="left" 
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'left'}
                            onDrop={onDrop}
                        />
                        <DropZone 
                            position="center" 
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'center'}
                            onDrop={onDrop}
                        />
                        <DropZone 
                            position="right" 
                            isDragActive={isDragActive}
                            isOver={activeDropZone === 'right'}
                            onDrop={onDrop}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
