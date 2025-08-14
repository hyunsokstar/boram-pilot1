"use client";

import React from 'react';
import DynamicTab from './dynamic-tab';

export interface TabItem {
    id: string;
    label: string;
    href?: string;
    menuNo?: string;
    isClosable?: boolean;
}

export interface TabBarProps {
    tabs: TabItem[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    onTabClose?: (tabId: string) => void;
    className?: string;
}

export default function TabBar({
    tabs,
    activeTab,
    onTabChange,
    onTabClose,
    className = ""
}: TabBarProps) {
    const handleTabClick = (tabId: string) => {
        onTabChange?.(tabId);
    };

    const handleCloseTab = (tabId: string) => {
        onTabClose?.(tabId);
    };

    if (tabs.length === 0) {
        return (
            <div className={`border-b border-gray-200 ${className}`}>
                <div className="py-4 px-1 text-sm text-gray-500">
                    헤더 메뉴를 클릭하여 탭을 추가하세요
                </div>
            </div>
        );
    }

    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="flex space-x-1" aria-label="Tabs">
                {tabs.map((tab) => (
                    <DynamicTab
                        key={tab.id}
                        id={tab.id}
                        label={tab.label}
                        isActive={activeTab === tab.id}
                        isClosable={tab.isClosable}
                        onTabClick={handleTabClick}
                        onTabClose={handleCloseTab}
                    />
                ))}
            </nav>
        </div>
    );
}
