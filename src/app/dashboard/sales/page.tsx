export default function SalesPage() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">영업 관리</h2>
                    <p className="text-slate-600 text-lg">영업 활동과 실적 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 영업활동 섹션 */}
                    <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-150 border-4 border-orange-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-orange-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-orange-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                </svg>
                            </div>
                            영업활동
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-orange-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">영업 일정</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-orange-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">고객 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-orange-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">상담 이력</span>
                            </button>
                        </div>
                    </div>

                    {/* 실적관리 섹션 */}
                    <div className="bg-gradient-to-br from-lime-50 via-lime-100 to-lime-150 border-4 border-lime-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-lime-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-lime-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            실적관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-lime-300 hover:border-lime-500 hover:bg-lime-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">매출 실적</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-lime-300 hover:border-lime-500 hover:bg-lime-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">영업 목표</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-lime-300 hover:border-lime-500 hover:bg-lime-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">성과 분석</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">현황 통계</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-orange-100 mb-2">이번 달 매출</h4>
                            <p className="text-3xl font-bold">₩125,600,000</p>
                        </div>
                        <div className="bg-gradient-to-br from-lime-500 to-lime-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-lime-100 mb-2">신규 고객</h4>
                            <p className="text-3xl font-bold">247</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-amber-100 mb-2">상담 건수</h4>
                            <p className="text-3xl font-bold">1,856</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-purple-100 mb-2">성약률</h4>
                            <p className="text-3xl font-bold">73.2%</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
