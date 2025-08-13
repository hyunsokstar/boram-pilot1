"use client";
import { useState, useCallback } from "react";
import { Resizable } from "re-resizable";

export default function DashboardSidebar() {
    const [expandedMenus, setExpandedMenus] = useState<string[]>(["조직관리"]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(304); // 48 (토글) + 256 (메인)

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        );
    };

    const handleResize = useCallback((
        _e: MouseEvent | TouchEvent,
        _direction: string,
        ref: HTMLElement
    ) => {
        // 현재 실제 너비를 직접 가져옴
        const currentWidth = ref.offsetWidth;
        setSidebarWidth(currentWidth);

        // 너무 작으면 자동으로 collapse
        if (currentWidth < 100) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false);
        }
    }, []);

    const handleResizeStop = useCallback((
        _e: MouseEvent | TouchEvent,
        _direction: string,
        ref: HTMLElement
    ) => {
        // 최종 크기 설정
        const finalWidth = ref.offsetWidth;
        setSidebarWidth(finalWidth);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(prev => {
            const newCollapsed = !prev;
            // 토글 시 전체 사이드바 크기도 조정
            if (newCollapsed) {
                setSidebarWidth(48); // 토글 버튼만
            } else {
                setSidebarWidth(304); // 토글 + 메인 영역
            }
            return newCollapsed;
        });
    };

    return (
        <Resizable
            size={{ width: sidebarWidth, height: "100%" }}
            onResize={handleResize}
            onResizeStop={handleResizeStop}
            minWidth={48} // 토글 버튼만
            maxWidth={500}
            enable={{
                top: false,
                right: true,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
            }}
            handleStyles={{
                right: {
                    width: '6px',
                    backgroundColor: 'rgba(148, 163, 184, 0.3)',
                    cursor: 'col-resize',
                    borderRadius: '0 4px 4px 0',
                    zIndex: 10,
                },
            }}
            handleClasses={{
                right: 'hover:bg-slate-400 transition-colors duration-200',
            }}
        >
            <div className="flex h-full min-h-0">
                {/* Toggle Button - Far Left */}
                <div className="w-12 bg-slate-700 flex flex-col h-full min-h-0">
                    <button
                        onClick={toggleSidebar}
                        className="p-3 text-white hover:bg-slate-600 transition-colors flex items-center justify-center flex-shrink-0"
                        aria-label="사이드바 토글"
                    >
                        <svg
                            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Vertical Icons */}
                    <div className="flex flex-col items-center py-4 space-y-4 flex-1 min-h-0">
                        <button className="p-2 text-gray-300 hover:text-white hover:bg-slate-600 rounded transition-colors flex-shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-600 rounded transition-colors flex-shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>

                        <button className="p-2 text-gray-300 hover:text-white hover:bg-slate-600 rounded transition-colors flex-shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Sidebar Content */}
                <aside
                    className={`${isCollapsed ? 'w-0' : 'flex-1'} transition-all duration-300 bg-slate-800 text-white flex flex-col h-full min-h-0 overflow-hidden`}
                    style={{ width: isCollapsed ? '0px' : `${sidebarWidth - 48}px` }}
                >
                    {!isCollapsed && (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-slate-600 flex-shrink-0">
                                <h2 className="text-lg font-semibold text-gray-100">조직/인사</h2>
                            </div>

                            {/* Sidebar Menu */}
                            <div className="flex-1 p-3 overflow-y-auto min-h-0">
                                {/* 조직관리 */}
                                <div className="mb-2">
                                    <button
                                        onClick={() => toggleMenu("조직관리")}
                                        className="w-full flex items-center justify-between p-2 text-left hover:bg-slate-700 rounded text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium text-gray-200">조직관리</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform text-gray-400 ${expandedMenus.includes("조직관리") ? 'rotate-90' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {expandedMenus.includes("조직관리") && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            <a href="#" className="block py-1 px-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded">부서등록</a>
                                            <a href="#" className="block py-1 px-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded">조직구성</a>
                                        </div>
                                    )}
                                </div>

                                {/* 인사관리 */}
                                <div className="mb-2">
                                    <button
                                        onClick={() => toggleMenu("인사관리")}
                                        className="w-full flex items-center justify-between p-2 text-left hover:bg-slate-700 rounded text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                            </svg>
                                            <span className="font-medium text-gray-200">인사관리</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform text-gray-400 ${expandedMenus.includes("인사관리") ? 'rotate-90' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {expandedMenus.includes("인사관리") && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            <a href="#" className="block py-1 px-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded">인사등록</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </Resizable>
    );
}
