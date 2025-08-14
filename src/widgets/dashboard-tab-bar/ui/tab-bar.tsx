"use client";

import React, { useState } from 'react';

export interface TabItem {
    id: string;
    label: string;
    href?: string;
}

export interface TabBarProps {
    tabs: TabItem[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
}

export default function TabBar({
    tabs,
    activeTab,
    onTabChange,
    className = ""
}: TabBarProps) {
    const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id);

    const handleTabClick = (tabId: string) => {
        setCurrentTab(tabId);
        onTabChange?.(tabId);
    };

    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${currentTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
            `}
                        aria-current={currentTab === tab.id ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}

// 기본 탭 데이터 예시
export const defaultTabs: TabItem[] = [
    { id: 'overview', label: '개요' },
    { id: 'analytics', label: '분석' },
    { id: 'reports', label: '보고서' },
    { id: 'settings', label: '설정' }
];
