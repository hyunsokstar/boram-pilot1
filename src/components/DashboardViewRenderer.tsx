"use client";
import { views } from "@/widgets/dashboard-views";

interface DashboardViewRendererProps {
  viewKey: string;
}

export default function DashboardViewRenderer({ viewKey }: DashboardViewRendererProps) {
  const Comp = views[viewKey];
  
  if (Comp) {
    return <Comp />;
  }

  // Fallback for missing views
  return (
    <section className="flex-1 p-8 text-center text-gray-400">
      View not found: {viewKey}
    </section>
  );
}
