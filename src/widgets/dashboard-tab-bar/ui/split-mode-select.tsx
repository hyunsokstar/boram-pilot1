'use client';

import { Popover } from '@/shared/headless/popover';
import { SplitMode } from '../model/types';
import { ChevronDown, Layout, Columns2, Columns3 } from 'lucide-react';

interface SplitModeSelectProps {
    currentMode: SplitMode;
    onModeChange: (mode: SplitMode) => void;
    className?: string;
    /** 트리거 버튼의 크기 ('compact' | 'normal' | 'full') */
    size?: 'compact' | 'normal' | 'full';
    /** 팝오버 패널의 너비 (Tailwind CSS 클래스) */
    panelWidth?: string;
    /** 팝오버 위치 */
    placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
    /** 라벨 표시 여부 */
    showLabel?: boolean;
}

const splitModeOptions = [
    {
        mode: 'single' as SplitMode,
        label: '1단',
        // description: '단일 영역',
        icon: Layout,
    },
    {
        mode: 'double' as SplitMode,
        label: '2단',
        // description: '좌우 분할',
        icon: Columns2,
    },
    {
        mode: 'triple' as SplitMode,
        label: '3단',
        // description: '좌중우 분할',
        icon: Columns3,
    },
];

export function SplitModeSelect({ 
    currentMode, 
    onModeChange, 
    className = '',
    size = 'normal',
    panelWidth = 'w-28',
    placement = 'bottom',
    showLabel = false
}: SplitModeSelectProps) {
    const currentOption = splitModeOptions.find(option => option.mode === currentMode);
    const CurrentIcon = currentOption?.icon || Layout;

    // 모든 옵션을 항상 표시 (사용자가 직접 선택할 수 있도록)
    const availableOptions = splitModeOptions;

    // 크기에 따른 스타일 설정
    const getSizeClasses = () => {
        switch (size) {
            case 'compact':
                return 'gap-1 px-1.5 py-1 text-xs';
            case 'normal':
                return 'gap-1 px-2 py-1.5 text-sm';
            case 'full':
                return 'gap-2 px-3 py-1.5 text-sm';
            default:
                return 'gap-1 px-2 py-1.5 text-sm';
        }
    };

    const triggerButton = (
        <button
            className={`
                inline-flex items-center ${getSizeClasses()} font-medium 
                bg-white border border-gray-200 rounded-md shadow-sm
                hover:bg-gray-50 hover:border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                transition-all duration-200
                ${className}
            `}
            title={`분할 모드: ${currentOption?.label}`}
        >
            <CurrentIcon className="w-4 h-4 text-gray-600" />
            {showLabel && <span className="text-gray-700">{currentOption?.label}</span>}
            <ChevronDown className="w-3 h-3 text-gray-500" />
        </button>
    );

    return (
        <Popover
            trigger={triggerButton}
            placement={placement}
            panelClassName={`${panelWidth} p-1`}
        >
            <div className="space-y-1">
                {availableOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = option.mode === currentMode;
                    const isDisabled = false; // 필터링된 옵션들은 모두 선택 가능

                    return (
                        <button
                            key={option.mode}
                            onClick={() => onModeChange(option.mode)}
                            disabled={isDisabled}
                            className={`
                                w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md
                                transition-colors duration-150
                                ${isActive
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }
                                ${isDisabled 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'cursor-pointer'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className="font-medium">{option.label}</span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-auto" />
                            )}
                        </button>
                    );
                })}
            </div>
        </Popover>
    );
}
