"use client";
import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { headerMenus, NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { findTopByPath } from "@/shared/config/common-nav-menus";
import { useNavStore } from "@/shared/store/navStore";

export default function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const setFilteredTop = useNavStore((s) => s.setFilteredTop);

    const activeTopNo = useMemo(
        () => (pathname ? findTopByPath(pathname)?.menuNo ?? null : null),
        [pathname]
    );

    const onHeaderClick = (menuNo: string, href: string) => {
        // 사이드바 필터링 설정
        setFilteredTop(menuNo);
        
        // 항상 사이드바 이벤트 발생 (메뉴 펼치기 용)
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo } }));
        }
        // href가 있으면 페이지 이동
        if (href && href.trim() !== "") {
            router.push(href);
        }
    };

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-200">
            <nav className="flex items-center justify-between px-6 py-3">
                {/* 로고/브랜드 영역 */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Boram</span>
                    </div>
                </div>

                {/* 메뉴 영역 */}
                <div className="flex items-center gap-1">
                    {headerMenus.map((m) => {
                        const isActive = activeTopNo === m.menuNo;
                        return (
                            <button
                                key={m.menuNo}
                                onClick={() => onHeaderClick(m.menuNo, m.href)}
                                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-[120px] ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95"
                                    }`}
                                title={m.label}
                            >
                                {/* 아이콘 컨테이너 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                                    isActive 
                                        ? "bg-indigo-100" 
                                        : "bg-gray-100 group-hover:bg-gray-200"
                                }`}>
                                    {m.iconUrl ? (
                                        <Image 
                                            src={m.iconUrl} 
                                            alt={`${m.label} 아이콘`} 
                                            width={18} 
                                            height={18} 
                                            className={`transition-opacity ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`}
                                        />
                                    ) : (
                                        <div className={`w-4 h-4 rounded-sm ${isActive ? "bg-indigo-400" : "bg-gray-400"}`} />
                                    )}
                                </div>
                                
                                {/* 텍스트 */}
                                <span className="font-medium">{m.label}</span>
                                
                                {/* 활성 상태 인디케이터 */}
                                {isActive && (
                                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />
                                )}
                                
                                {/* 호버 효과 */}
                                <div className={`absolute inset-0 rounded-lg transition-opacity ${
                                    isActive ? "opacity-0" : "opacity-0 group-hover:opacity-5 group-hover:bg-gray-900"
                                }`} />
                            </button>
                        );
                    })}
                </div>

                {/* 사용자 정보 영역 (추후 확장 가능) */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </nav>
        </header>
    );
}
