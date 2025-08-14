"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        // 대시보드 첫 진입시 조직관리 페이지로 리다이렉트
        router.push("/dashboard/organization");
    }, [router]);

    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">대시보드 메인 컨텐츠</h2>
                    <p className="text-slate-600 text-lg">전체 시스템 현황을 한눈에 확인할 수 있습니다.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">총 직원 수</h3>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-bold mb-2">1,247</p>
                        <div className="text-blue-100 text-sm">
                            <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                전월 대비 +5%
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">부서 수</h3>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-bold mb-2">12</p>
                        <div className="text-emerald-100 text-sm">
                            <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                신규 부서 1개
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-8 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">신규 등록</h3>
                            <div className="p-3 bg-white/20 rounded-lg">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-bold mb-2">23</p>
                        <div className="text-violet-100 text-sm">
                            <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                이번 주 등록
                            </span>
                        </div>
                    </div>
                </div>

                {/* 추가 정보 섹션 */}
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">빠른 접근</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left">
                            <div className="text-slate-700 font-semibold">조직/인사</div>
                            <div className="text-slate-500 text-sm mt-1">직원 및 조직 관리</div>
                        </button>
                        <button className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left">
                            <div className="text-slate-700 font-semibold">회원/계약</div>
                            <div className="text-slate-500 text-sm mt-1">회원 정보 관리</div>
                        </button>
                        <button className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left">
                            <div className="text-slate-700 font-semibold">수납</div>
                            <div className="text-slate-500 text-sm mt-1">결제 및 수납 관리</div>
                        </button>
                        <button className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-left">
                            <div className="text-slate-700 font-semibold">영업관리</div>
                            <div className="text-slate-500 text-sm mt-1">영업 활동 관리</div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}