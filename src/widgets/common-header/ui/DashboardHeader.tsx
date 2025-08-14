"use client";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { headerMenus, NAV_OPEN_TOP_EVENT } from "@/shared/config/header-menus";
import { findTopByPath } from "@/shared/config/common-nav-menus"; // ← 공통 유틸 사용

export default function DashboardHeader() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const activeTopNo = useMemo(
        () => (pathname ? findTopByPath(pathname)?.menuNo ?? null : null),
        [pathname]
    );

    const onHeaderClick = (menuNo: string, href: string) => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(NAV_OPEN_TOP_EVENT, { detail: { menuNo } }));
        }
        if (href) router.push(href);
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
                                <img src={m.iconUrl} alt="" className="w-5 h-5 opacity-90" />
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
