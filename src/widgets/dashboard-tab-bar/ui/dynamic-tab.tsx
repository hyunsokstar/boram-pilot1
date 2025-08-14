"use client";

import React from 'react';

interface DynamicTabProps {
    id: string;
    label: string;
    isActive: boolean;
    isClosable?: boolean;
    onTabClick: (tabId: string) => void;
    onTabClose?: (tabId: string) => void;
}

export default function DynamicTab({
    id,
    label,
    isActive,
    isClosable = true,
    onTabClick,
    onTabClose
}: DynamicTabProps) {
    const handleClick = () => {
        onTabClick(id);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onTabClose?.(id);
    };

    return (
        <div
            className={`
                group relative flex items-center px-3 py-2 border-b-2 font-medium text-sm transition-colors duration-200 cursor-pointer
                ${isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
            `}
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className="whitespace-nowrap">{label}</span>

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
        </div>
    );
}
