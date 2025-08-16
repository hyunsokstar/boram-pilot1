"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_OPEN_TOP_EVENT, type NavOpenTopDetail } from "@/shared/config/common-nav-menus";
import { sideMenus, type SideMenuItem as SideMenu } from "@/shared/config/common-nav-menus";
import { useNavStore } from "@/shared/store/navStore";
import { useTabStore } from "@/widgets/dashboard-tab-bar/model/tabStore";
import { resolveViewByHref } from "@/widgets/dashboard-views";
import { Resizable, type ResizeCallback } from "re-resizable";
import SidebarMenuItem from "./SidebarMenuItem";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // zustand 상태
    const expandedSet = useNavStore((s) => s.expanded);
    const activeTopNo = useNavStore((s) => s.activeTopNo);
    const activeLeafNo = useNavStore((s) => s.activeLeafNo);
    const filteredTopNo = useNavStore((s) => s.filteredTopNo);
    const toggle = useNavStore((s) => s.toggle);
    const openTop = useNavStore((s) => s.openTop);
    const setFromPath = useNavStore((s) => s.setFromPath);

    // 탭 스토어
    const addTab = useTabStore((s) => s.addTab);

    // UI 상태
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(304);
    const [highlightTopNo, setHighlightTopNo] = useState<string | null>(null);
    const topRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // 경로 변경 → 활성/확장 동기화
    useEffect(() => {
        if (pathname) setFromPath(pathname);
    }, [pathname, setFromPath]);

    // 헤더 이벤트 수신
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

    // 메뉴 클릭 핸들러
    const handleMenuClick = useCallback((menu: SideMenu, hasSubMenu: boolean) => {
        if (hasSubMenu) {
            // 하위 메뉴가 있으면 토글만
            toggle(menu.menuNo);
        } else if (menu.menuHref && menu.menuHref.trim()) {
            // 하위 메뉴가 없고 href가 있으면 탭 등록 후 페이지 이동
            const View = resolveViewByHref(menu.menuHref) || undefined;
            addTab({
                id: menu.menuNo,
                label: menu.menuNm,
                href: menu.menuHref,
                menuNo: menu.menuNo,
                isClosable: true,
                view: View
            });
            
            router.push(menu.menuHref);
        }
    }, [toggle, router, addTab]);

    // 현재 활성 메뉴인지 정확히 판단
    const isActiveMenu = useCallback((menu: SideMenu): boolean => {
        return activeLeafNo === menu.menuNo || activeTopNo === menu.menuNo;
    }, [activeLeafNo, activeTopNo]);

    // 하위에 활성 메뉴가 있는지 판단
    const hasActiveDescendant = useCallback((node: SideMenu): boolean => {
        if (isActiveMenu(node)) return true;
        return node.subMenu?.some((child) => hasActiveDescendant(child)) ?? false;
    }, [isActiveMenu]);

    const renderMenu = (menu: SideMenu, level = 0) => {
        const isTop = level === 0;
        const hasSubMenu = !!menu.subMenu?.length;
        const isExpanded = expandedSet.has(menu.menuNo);
        const isActiveLeaf = !hasSubMenu && !isTop && activeLeafNo === menu.menuNo;
        const branchHasActive = hasActiveDescendant(menu);
        const paddingLeft = level * 16 + 8;

        // 최상위 단독 메뉴의 활성 상태 (강한 부각)
        const isActiveTopLabel = isTop && !hasSubMenu && activeTopNo === menu.menuNo;

        // 최상위 브랜치가 직접 활성인 경우 (최상위 메뉴 자체가 선택됨)
        const isActiveTopSelf = isTop && hasSubMenu && activeTopNo === menu.menuNo && activeLeafNo === null;

        return (
            <div
                key={menu.menuNo}
                ref={isTop ? (el) => { topRefs.current[menu.menuNo] = el; } : undefined}
                className="mb-1"
            >
                {/* 최상위 + 하위 있음 → 토글 버튼 */}
                {isTop && hasSubMenu ? (
                    <SidebarMenuItem
                        menuNm={menu.menuNm}
                        onClick={() => handleMenuClick(menu, hasSubMenu)}
                        isActive={isActiveTopSelf}
                        hasSubMenu={hasSubMenu}
                        isExpanded={isExpanded}
                        paddingLeft={paddingLeft}
                        isTop={true}
                        highlightTopNo={highlightTopNo}
                        menuNo={menu.menuNo}
                        icon={<span className={`inline-block w-1.5 h-1.5 rounded-full ${branchHasActive ? "bg-indigo-400" : "bg-gray-400"}`} />}
                    />
                ) : null}

                {/* 최상위 + 하위 없음 → 클릭 가능한 라벨 (강한 선택 효과) */}
                {isTop && !hasSubMenu ? (
                    <button
                        onClick={() => handleMenuClick(menu, hasSubMenu)}
                        disabled={!menu.menuHref || !menu.menuHref.trim()}
                        className={`w-full flex items-center p-2 rounded text-sm transition-all duration-200 text-left active:scale-95 ${isActiveTopLabel
                            ? "bg-slate-700/80 text-white font-semibold border-l-3 border-indigo-400 shadow-md"
                            : "text-white hover:bg-slate-700/40 active:bg-slate-600"
                            } ${highlightTopNo === menu.menuNo ? "ring-2 ring-indigo-400/60" : ""}
                            ${!menu.menuHref || !menu.menuHref.trim() ? "cursor-default" : "cursor-pointer"}`}
                        style={{ paddingLeft }}
                        aria-current={isActiveTopLabel ? "page" : undefined}
                    >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActiveTopLabel ? "bg-indigo-400" : "bg-gray-400"} mr-2`} />
                        <span className="font-medium">{menu.menuNm}</span>
                    </button>
                ) : null}

                {/* 중간 브랜치 → 토글 버튼 */}
                {!isTop && hasSubMenu ? (
                    <button
                        onClick={() => handleMenuClick(menu, hasSubMenu)}
                        className="w-full flex items-center justify-between p-2 text-left rounded text-sm transition-all duration-200 hover:bg-slate-700 active:scale-95 active:bg-slate-600"
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

                {/* 리프 메뉴 → 클릭 가능한 링크 (강한 선택 효과) */}
                {!hasSubMenu && !isTop ? (
                    <button
                        onClick={() => handleMenuClick(menu, hasSubMenu)}
                        disabled={!menu.menuHref || !menu.menuHref.trim()}
                        className={`block w-full p-2 text-left rounded text-sm transition-all duration-200 active:scale-95 ${isActiveLeaf
                            ? "bg-slate-700 text-white font-medium border-l-2 border-indigo-400"
                            : "text-gray-300 hover:text-white hover:bg-slate-700 active:bg-slate-600"
                            } ${!menu.menuHref || !menu.menuHref.trim() ? "cursor-default opacity-50" : "cursor-pointer"}`}
                        style={{ paddingLeft }}
                        aria-current={isActiveLeaf ? "page" : undefined}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActiveLeaf ? "bg-indigo-400" : "bg-gray-500"}`} />
                            <span>{menu.menuNm}</span>
                        </div>
                    </button>
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

    const handleResize: ResizeCallback = useCallback((_e, _d, ref) => {
        const w = ref.offsetWidth;
        setSidebarWidth(w);
        setIsCollapsed(w < 100);
    }, []);

    const handleResizeStop: ResizeCallback = useCallback((_e, _d, ref) => {
        setSidebarWidth(ref.offsetWidth);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            setSidebarWidth(next ? 48 : 304);
            return next;
        });
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
                        onClick={toggleSidebar}
                        className="p-3 text-white hover:bg-slate-600 transition-colors flex items-center justify-center flex-shrink-0"
                        aria-label="사이드바 토글"
                    >
                        <svg className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
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
                                {/* 필터링 상태 표시 및 전체 보기 버튼 */}
                                {filteredTopNo && (
                                    <div className="mb-3 p-2 bg-slate-700/50 rounded text-sm">
                                        <div className="flex items-center justify-between text-gray-300">
                                            <span>필터링 중: {sideMenus.find(m => m.menuNo === filteredTopNo)?.menuNm}</span>
                                            <button
                                                onClick={() => useNavStore.getState().setFilteredTop(null)}
                                                className="text-indigo-400 hover:text-indigo-300 text-xs"
                                            >
                                                전체 보기
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {sideMenus
                                    .filter(menu => filteredTopNo ? menu.menuNo === filteredTopNo : true)
                                    .map((menu) => renderMenu(menu as SideMenu, 0))
                                }
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </Resizable>
    );
}
