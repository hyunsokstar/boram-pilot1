"use client";

import React from "react";
import { useTabStore } from "../model/tabStore";
import { SplitMode } from "../model/types";

interface EmptyAreaOverlayProps {
    area: 'left' | 'center' | 'right';
}

export function EmptyAreaOverlay({ area }: EmptyAreaOverlayProps) {
    const { splitMode, setSplitMode, getAllTabs } = useTabStore();
    const allTabs = getAllTabs();
    const hasAnyTabs = allTabs.length > 0;

    // 영역별 메시지와 액션 정의
    const getAreaInfo = () => {
        switch (area) {
            case 'left':
                return {
                    title: "왼쪽 영역",
                    description: "메인 작업 영역입니다",
                    icon: "🏠",
                    suggestions: []
                };
                
            case 'center':
                if (splitMode === 'single') {
                    return {
                        title: "화면 분할하기",
                        description: "더 효율적인 작업을 위해 화면을 분할해보세요",
                        icon: "📱",
                        suggestions: [
                            {
                                label: "2단 분할로 전환",
                                action: () => setSplitMode('double'),
                                description: "좌/우 2개 영역으로 분할합니다"
                            }
                        ]
                    };
                }
                return {
                    title: "가운데 영역",
                    description: "비교 작업에 활용해보세요",
                    icon: "⚖️",
                    suggestions: []
                };
                
            case 'right':
                if (splitMode === 'single') {
                    return {
                        title: "화면 분할하기",
                        description: "더 효율적인 작업을 위해 화면을 분할해보세요",
                        icon: "📱",
                        suggestions: [
                            {
                                label: "2단 분할로 전환",
                                action: () => setSplitMode('double'),
                                description: "좌/우 2개 영역으로 분할합니다"
                            }
                        ]
                    };
                } else if (splitMode === 'double') {
                    return {
                        title: "화면 확장하기",
                        description: "3단 분할로 더 많은 정보를 한번에 확인하세요",
                        icon: "📊",
                        suggestions: [
                            {
                                label: "3단 분할로 전환",
                                action: () => setSplitMode('triple'),
                                description: "좌/가운데/우 3개 영역으로 확장합니다"
                            }
                        ]
                    };
                }
                return {
                    title: "오른쪽 영역",
                    description: "보조 정보나 참고 자료를 표시하세요",
                    icon: "📋",
                    suggestions: []
                };
        }
    };

    const areaInfo = getAreaInfo();

    // 탭이 없는 경우 첫 시작 안내
    if (!hasAnyTabs) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="text-6xl mb-6">🚀</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                        Boram 대시보드에 오신 것을 환영합니다!
                    </h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        위의 헤더 메뉴를 클릭하여 원하는 기능을 시작해보세요.
                        각 메뉴는 탭으로 열리며, 필요에 따라 화면을 분할하여 
                        여러 작업을 동시에 진행할 수 있습니다.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                            💡 <strong>팁:</strong> 상단 헤더의 분할 모드 버튼으로 
                            화면을 2단, 3단으로 나누어 사용할 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 영역별 안내 표시
    return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200">
            <div className="text-center max-w-sm mx-auto px-6">
                <div className="text-4xl mb-4">{areaInfo.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {areaInfo.title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {areaInfo.description}
                </p>
                
                {areaInfo.suggestions.length > 0 && (
                    <div className="space-y-3">
                        {areaInfo.suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={suggestion.action}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                        {areaInfo.suggestions.map((suggestion, index) => (
                            <p key={`desc-${index}`} className="text-xs text-gray-500 mt-1">
                                {suggestion.description}
                            </p>
                        ))}
                    </div>
                )}
                
                {/* 드래그 앤 드롭 안내 */}
                {hasAnyTabs && (
                    <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600">
                            💡 탭을 드래그하여 이 영역으로 이동할 수 있습니다
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
