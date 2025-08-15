/**
 * @fileoverview 드래그 앤 드롭이 가능한 탭 컴포넌트
 * @description dnd-kit을 사용하여 탭 순서를 변경할 수 있는 개별 탭 컴포넌트
 */

"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { TabArea } from '../model/types';

/**
 * 드래그 가능한 탭 컴포넌트의 Props
 */
interface DraggableTabProps {
    /** 탭 고유 ID */
    id: string;
    /** 탭 라벨 */
    label: string;
    /** 활성화 상태 */
    isActive: boolean;
    /** 닫기 가능 여부 */
    isClosable?: boolean;
    /** 탭 클릭 핸들러 */
    onTabClick: (tabId: string) => void;
    /** 탭 닫기 핸들러 */
    onTabClose?: (tabId: string) => void;
    /** 탭이 속한 영역 (TabGroup에서 사용) */
    area?: TabArea;
}

/**
 * 드래그 앤 드롭이 가능한 탭 컴포넌트
 * 
 * @description 
 * - dnd-kit의 useSortable을 사용하여 드래그 기능 구현
 * - 드래그 중에는 시각적 피드백 제공
 * - 기존 DynamicTab과 동일한 UI/UX 유지
 * 
 * @example
 * ```tsx
 * <DraggableTab
 *   id="tab-1"
 *   label="조직/사원"
 *   isActive={true}
 *   onTabClick={handleTabClick}
 *   onTabClose={handleTabClose}
 * />
 * ```
 */
export default function DraggableTab({
    id,
    label,
    isActive,
    isClosable = true,
    onTabClick,
    onTabClose,
    area
}: DraggableTabProps) {
    // dnd-kit의 sortable 훅 사용 (순서 변경과 영역 간 이동 모두 지원)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        data: {
            type: 'tab',
            area: area, // 영역 정보를 data로 전달
            label: label, // 라벨도 전달
        }
    });

    // 드롭존 기능 추가 (다른 탭이 이 탭 위에 드롭될 수 있도록)
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `tab-drop-${id}`,
        data: {
            type: 'tab-area',
            area: area,
        },
    });

    // 두 ref를 결합하는 함수
    const setRefs = (node: HTMLElement | null) => {
        setNodeRef(node);
        setDropRef(node);
    };

    // 드래그 중 스타일 적용 - 더 부드러운 애니메이션
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // 드래그 중에는 완전히 투명하게 (DragOverlay가 대신 표시)
        opacity: isDragging ? 0 : 1,
        // 드래그 중에는 z-index 높게 - 다른 영역으로 이동할 수 있도록
        zIndex: isDragging ? 9999 : 1,
    };

    /**
     * 탭 클릭 핸들러
     * 드래그 중이 아닐 때만 탭 변경 실행
     */
    const handleClick = () => {
        if (!isDragging) {
            onTabClick(id);
        }
    };

    /**
     * 탭 닫기 핸들러
     * 이벤트 전파 방지 및 드래그와 분리
     */
    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onTabClose?.(id);
    };

    return (
        <div
            ref={setRefs}
            style={style}
            className={`
                group relative flex items-center px-3 py-1.5 border-2 font-medium text-sm transition-all duration-200 cursor-pointer
                ${isActive
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-white bg-white'
                }
                ${isDragging ? 'shadow-lg border-blue-400 bg-blue-100' : ''}
                ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''}
                min-w-0 flex-shrink-0 h-8
            `}
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
            // 드래그 속성들 적용
            {...attributes}
            {...listeners}
        >
            {/* 드래그 핸들 아이콘 */}
            <div className="mr-2 opacity-0 group-hover:opacity-60 transition-opacity">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 6h2v2H8zm0 4h2v2H8zm0 4h2v2H8zm6-8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2z" />
                </svg>
            </div>

            {/* 탭 라벨 */}
            <span className="whitespace-nowrap select-none truncate">{label}</span>

            {/* 닫기 버튼 */}
            {isClosable && (
                <button
                    type="button"
                    onClick={handleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`
                        ml-2 p-1 border rounded transition-all duration-200 flex-shrink-0
                        ${isActive
                            ? 'text-blue-600 border-blue-300 hover:text-blue-800 hover:border-blue-400 hover:bg-blue-100'
                            : 'text-gray-500 border-gray-300 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-100'
                        }
                        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300
                    `}
                    title="탭 닫기"
                    aria-label={`${label} 탭 닫기`}
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
