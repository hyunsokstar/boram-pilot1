import type { ReactNode } from "react";
import DashboardHeader from "@/widgets/common-header";
import DashboardSidebar from "@/widgets/common-sidebar";
import { ProtectedRoute } from "@/shared/ui";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col">
                <DashboardHeader />
                <main className="flex-1 flex min-h-0">
                    <DashboardSidebar />
                    <div className="flex-1 bg-white">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
