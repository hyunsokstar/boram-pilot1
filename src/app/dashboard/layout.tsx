"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { TabBar } from "@/widgets/dashboard-tab-bar";
import { ProtectedRoute } from "@/shared/ui";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const dashboardTabs = [
        { id: 'organization', label: '조직/인사' },
        { id: 'member', label: '회원/계약' },
        { id: 'payment', label: '수납' },
        { id: 'sales', label: '영업관리' },
        { id: 'crm', label: 'CRM' },
        { id: 'hr', label: 'HR' },
        { id: 'event', label: '이벤트' },
        { id: 'purchase', label: '구매' },
        { id: 'system', label: '시스템관리' }
    ];

    // 현재 경로에서 활성 탭 추출
    const getCurrentTab = () => {
        const pathSegments = pathname.split('/');
        const currentPage = pathSegments[2]; // /dashboard/[page]

        // 기본 대시보드 경로면 organization으로 설정
        if (!currentPage || currentPage === '') {
            return 'organization';
        }

        return currentPage;
    };

    const handleTabChange = (tabId: string) => {
        router.push(`/dashboard/${tabId}`);
    };

    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col">
                <DashboardHeader />
                <main className="flex-1 flex min-h-0">
                    <DashboardSidebar />
                    <div className="flex-1 bg-white flex flex-col">
                        <div className="border-b border-gray-200 bg-white">
                            <div className="px-6">
                                <TabBar
                                    tabs={dashboardTabs}
                                    activeTab={getCurrentTab()}
                                    onTabChange={handleTabChange}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
