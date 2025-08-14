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
        <header className="w-full">
            <nav className="flex items-center gap-3">
                {headerMenus.map((m) => {
                    const isActive = activeTopNo === m.menuNo;
                    return (
                        <button
                            key={m.menuNo}
                            onClick={() => onHeaderClick(m.menuNo, m.href)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded text-sm transition-colors min-w-[68px] ${isActive
                                    ? "bg-slate-100 text-slate-900 border-b-2 border-indigo-500"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                            title={m.label}
                        >
                            {m.iconUrl ? (
                                <Image src={m.iconUrl} alt="" width={20} height={20} className="opacity-90" />
                            ) : (
                                <span className="w-5 h-5" />
                            )}
                            <span className="text-xs">{m.label}</span>
                        </button>
                    );
                })}
            </nav>
        </header>
    );
}
