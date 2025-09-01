"use client";
import DashboardViewRenderer from "@/components/DashboardViewRenderer";
import { use } from "react";

type Params = { slug?: string[] };

export default function SystemCatchAllPage({ params }: { params: Promise<Params> }) {
  // Next.js 15에서 params는 Promise입니다
  const resolvedParams = use(params);
  
  // system/ 이후의 경로를 구성
  const slug = Array.isArray(resolvedParams.slug) && resolvedParams.slug.length > 0 
    ? resolvedParams.slug.join("/") 
    : "";
  
  const viewKey = slug ? `system/${slug}` : "system";

  return <DashboardViewRenderer viewKey={viewKey} />;
}
