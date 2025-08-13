"use client";
import { useState } from "react";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-cyan-200 h-10 flex items-center justify-between px-3 sm:px-4 border-b border-cyan-300">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="메뉴"
          className="w-6 h-6 rounded hover:bg-cyan-300/60 flex items-center justify-center"
        >
          <span className="block w-4 h-[2px] bg-cyan-800" />
        </button>
        <nav className="hidden md:flex items-center gap-4 text-sm text-cyan-900">
          <span className="font-semibold">조직/인사</span>
          <span>회원/계약</span>
          <span>수납</span>
          <span>영업관리</span>
          <span>행사</span>
          <span>구매/재고</span>
          <span>CRM</span>
          <span>시스템</span>
        </nav>
      </div>

      <div className="relative">
        <button
          type="button"
          className="text-sm text-cyan-900 hover:underline"
          onClick={() => setOpen((v) => !v)}
        >
          전사문 / 관리자
        </button>
        {open && (
          <ul className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded border text-sm z-10">
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">환경설정</li>
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">비밀번호변경</li>
            <li className="px-3 py-2 hover:bg-gray-50 cursor-pointer">로그아웃</li>
          </ul>
        )}
      </div>
    </header>
  );
}
