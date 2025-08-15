"use client";

import React from "react";

export function makeScaffoldView(title: string, subtitle = "구현 예정 화면입니다.") {
  const Comp: React.FC = () => (
    <section className="flex-1 p-8 bg-slate-50">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="border-b border-slate-200 pb-6 mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">{title}</h2>
          <p className="text-slate-600 text-lg">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="text-sm text-slate-500 mb-2">섹션 {i}</div>
              <div className="h-16 bg-slate-100 rounded-md border border-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  Comp.displayName = `ScaffoldView(${title})`;
  return Comp;
}
