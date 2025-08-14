"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { NAV_OPEN_TOP_EVENT, type NavOpenTopDetail } from "@/shared/config/common-nav-menus";
import { sideMenus, type SideMenuItem as SideMenu } from "@/shared/config/side-menus";
import { useNavStore } from "@/shared/store/navStore";
import { Resizable } from "re-resizable";

export default function DashboardSidebar() {
    const pathname = usePathname();

    // zustand
    const expandedSet = useNavStore((s) => s.expanded);
    const activeLeafNo = useNavStore((s) => s.activeLeafNo);
    const toggle = useNavStore((s) => s.toggle);
    const openTop = useNavStore((s) => s.openTop);
    const setFromPath = useNavStore((s) => s.setFromPath);

    // UI
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(304);
    const expandedMenus = useMemo(() => Array.from(expandedSet), [expandedSet]);

    // 헤더 클릭 시 강조용(일시적 하이라이트)
    const [highlightTopNo, setHighlightTopNo] = useState<string | null>(null);
    const topRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // 경로 → 활성/확장 동기화
    useEffect(() => {
        if (pathname) setFromPath(pathname);
    }, [pathname, setFromPath]);

    // 헤더 → 사이드: 최상위 확장 + 강조 + 스크롤
    useEffect(() => {
        let timeoutId: number | undefined;
        const handler = (e: Event) => {
            const { menuNo } = (e as CustomEvent<NavOpenTopDetail>).detail || {};
            if (!menuNo) return;
            openTop(menuNo);
            setHighlightTopNo(menuNo);
            const el = topRefs.current[menuNo];
            if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });
            timeoutId = window.setTimeout(() => setHighlightTopNo((v) => (v === menuNo ? null : v)), 1200);
        };
        window.addEventListener(NAV_OPEN_TOP_EVENT, handler as EventListener);
        return () => {
            window.removeEventListener(NAV_OPEN_TOP_EVENT, handler as EventListener);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, [openTop]);

    const handleResize = useCallback((_e: any, _d: any, ref: HTMLElement) => {
        const w = ref.offsetWidth;
        setSidebarWidth(w);
        setIsCollapsed(w < 100);
    }, []);
    const handleResizeStop = useCallback((_e: any, _d: any, ref: HTMLElement) => {
        setSidebarWidth(ref.offsetWidth);
    }, []);

    // 하위에 활성 leaf가 있는지
    const hasActiveDescendant = useCallback((node: SideMenu): boolean => {
        if (!node.subMenu?.length) return node.menuNo === activeLeafNo;
        return node.subMenu.some((c) => hasActiveDescendant(c));
    }, [activeLeafNo]);

    const renderMenu = (menu: SideMenu, level = 0) => {
        const isTop = level === 0;
        const hasSubMenu = !!menu.subMenu?.length;
        const isExpanded = expandedSet.has(menu.menuNo);
        const isActiveLeaf = !hasSubMenu && !isTop && activeLeafNo === menu.menuNo;
        const branchHasActive = hasActiveDescendant(menu);
        const paddingLeft = level * 16 + 8;

        // 최상위 + 하위 없음인 경우 현재 경로로 활성 판단
        const isActiveTopLabel = isTop && !hasSubMenu && !!menu.menuHref && !!pathname && pathname.startsWith(menu.menuHref);

        return (
            <div
                key={menu.menuNo}
                ref={isTop ? (el) => { topRefs.current[menu.menuNo] = el; } : undefined}
                className="mb-1"
            >
                {/* 1) 최상위 + 하위 있음 → 토글 버튼 */}
                {isTop && hasSubMenu ? (
                    <button
                        onClick={() => toggle(menu.menuNo)}
                        className={`w-full flex items-center justify-between p-2 text-left rounded text-sm transition-colors hover:bg-slate-700
                        ${highlightTopNo === menu.menuNo ? "ring-2 ring-indigo-400/60" : ""}`}
                        style={{ paddingLeft }}
                        aria-expanded={isExpanded}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${branchHasActive ? "bg-indigo-400" : "bg-gray-400"}`} />
                            <span className="font-medium text-white">{menu.menuNm}</span>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90 text-gray-100" : "text-gray-400"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                ) : null}

                {/* 2) 최상위 + 하위 없음 → 페이지 라벨 (선택 부각) */}
                {isTop && !hasSubMenu ? (
                    <div
                        className={`w-full flex items-center p-2 rounded text-sm select-none transition-colors ${isActiveTopLabel
                                ? "bg-slate-700/80 text-white font-semibold border-l-3 border-indigo-400 shadow-md"
                                : "text-white hover:bg-slate-700/40"
                            } ${highlightTopNo === menu.menuNo ? "ring-2 ring-indigo-400/60" : ""}`}
                        style={{ paddingLeft }}
                        aria-current={isActiveTopLabel ? "page" : undefined}
                    >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActiveTopLabel ? "bg-indigo-400" : "bg-gray-400"} mr-2`} />
                        <span className="font-medium">{menu.menuNm}</span>
                    </div>
                ) : null}

                {/* 3) 중간 브랜치 → 토글 버튼 */}
                {!isTop && hasSubMenu ? (
                    <button
                        onClick={() => toggle(menu.menuNo)}
                        className="w-full flex items-center justify-between p-2 text-left rounded text-sm transition-colors hover:bg-slate-700"
                        style={{ paddingLeft }}
                        aria-expanded={isExpanded}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${branchHasActive ? "bg-indigo-400" : "bg-gray-400"}`} />
                            <span className="font-medium text-gray-200">{menu.menuNm}</span>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90 text-gray-100" : "text-gray-400"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                ) : null}

                {/* 4) 리프 메뉴 → 링크 */}
                {!hasSubMenu && !isTop ? (
                    <a
                        href={menu.menuHref}
                        aria-current={isActiveLeaf ? "page" : undefined}
                        className={`block w-full p-2 text-left rounded text-sm transition-colors ${isActiveLeaf
                                ? "bg-slate-700 text-white font-medium border-l-2 border-indigo-400"
                                : "text-gray-300 hover:text-white hover:bg-slate-700"
                            }`}
                        style={{ paddingLeft }}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActiveLeaf ? "bg-indigo-400" : "bg-gray-500"}`} />
                            <span>{menu.menuNm}</span>
                        </div>
                    </a>
                ) : null}

                {/* 자식 렌더링 */}
                {hasSubMenu && isExpanded && (
                    <div className="mt-1">
                        {menu.subMenu!.map((sub) => renderMenu(sub, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Resizable
            size={{ width: sidebarWidth, height: "100%" }}
            onResize={handleResize}
            onResizeStop={handleResizeStop}
            minWidth={48}
            maxWidth={500}
            enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            handleStyles={{ right: { width: "6px", backgroundColor: "rgba(148,163,184,0.3)", cursor: "col-resize", borderRadius: "0 4px 4px 0", zIndex: 10 } }}
            handleClasses={{ right: "hover:bg-slate-400 transition-colors duration-200" }}
        >
            <div className="flex h-full min-h-0">
                <div className="w-12 bg-slate-700 flex flex-col h-full min-h-0">
                    <button
                        onClick={() => setIsCollapsed((prev) => {
                            const next = !prev;
                            setSidebarWidth(next ? 48 : 304);
                            return next;
                        })}
                        className="p-3 text-white hover:bg-slate-600 transition-colors flex items-center justify-center flex-shrink-0"
                        aria-label="사이드바 토글"
                    >
                        <svg className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
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

                <aside
                    className={`${isCollapsed ? "w-0" : "flex-1"} transition-all duration-300 bg-slate-800 text-white flex flex-col h-full min-h-0 overflow-hidden`}
                    style={{ width: isCollapsed ? "0px" : `${sidebarWidth - 48}px` }}
                >
                    {!isCollapsed && (
                        <>
                            <div className="p-4 border-b border-slate-600 flex-shrink-0">
                                <h2 className="text-lg font-semibold text-gray-100">메뉴</h2>
                            </div>
                            <div className="flex-1 p-3 overflow-y-auto min-h-0">
                                {sideMenus.map((top) => renderMenu(top as SideMenu, 0))}
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </Resizable>
    );
}
