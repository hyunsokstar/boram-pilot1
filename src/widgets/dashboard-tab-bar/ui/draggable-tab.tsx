/**
 * @fileoverview 드래그 앤 드롭이 가능한 탭 컴포넌트
 * @description dnd-kit을 사용하여 탭 순서를 변경할 수 있는 개별 탭 컴포넌트
 */

"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    onTabClose
}: DraggableTabProps) {
    // dnd-kit의 sortable 훅 사용
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    // 드래그 중 스타일 적용
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // 드래그 중에는 약간 투명하게
        opacity: isDragging ? 0.8 : 1,
        // 드래그 중에는 z-index 높게
        zIndex: isDragging ? 1000 : 1,
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
            ref={setNodeRef}
            style={style}
            className={`
                group relative flex items-center px-3 py-2 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer
                ${isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
                ${isDragging ? 'shadow-lg ring-2 ring-blue-300 rounded-lg' : ''}
            `}
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
            // 드래그 속성들 적용
            {...attributes}
            {...listeners}
        >
            {/* 드래그 핸들 아이콘 (선택사항) */}
            <div className="mr-2 opacity-0 group-hover:opacity-50 transition-opacity">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
                </svg>
            </div>

            {/* 탭 라벨 */}
            <span className="whitespace-nowrap select-none">{label}</span>

            {/* 닫기 버튼 */}
            {isClosable && (
                <button
                    type="button"
                    onClick={handleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`
                        ml-2 px-1.5 py-1.5 rounded-full transition-all duration-200 flex-shrink-0
                        ${isActive
                            ? 'text-blue-400 hover:text-blue-600 hover:bg-blue-100 opacity-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 opacity-70 group-hover:opacity-100'
                        }
                        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300
                    `}
                    title="탭 닫기"
                    aria-label={`${label} 탭 닫기`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* 드래그 중일 때 표시할 플레이스홀더 */}
            {isDragging && (
                <div className="absolute inset-0 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg opacity-50" />
            )}
        </div>
    );
}
