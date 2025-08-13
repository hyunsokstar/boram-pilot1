export default function SystemPage() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">시스템 관리</h2>
                    <p className="text-slate-600 text-lg">시스템 설정과 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 시스템설정 섹션 */}
                    <div className="bg-gradient-to-br from-red-50 via-red-100 to-red-150 border-4 border-red-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-red-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-red-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            시스템설정
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-red-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">기본 설정</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-red-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">권한 설정</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-red-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">코드 관리</span>
                            </button>
                        </div>
                    </div>

                    {/* 시스템관리 섹션 */}
                    <div className="bg-gradient-to-br from-teal-50 via-teal-100 to-teal-150 border-4 border-teal-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-teal-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-teal-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            시스템관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">백업 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">로그 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">성능 모니터링</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">시스템 현황</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-red-100 mb-2">시스템 가동률</h4>
                            <p className="text-3xl font-bold">99.8%</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-teal-100 mb-2">활성 사용자</h4>
                            <p className="text-3xl font-bold">847</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-amber-100 mb-2">데이터 크기</h4>
                            <p className="text-3xl font-bold">2.4TB</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-pink-100 mb-2">오류 건수</h4>
                            <p className="text-3xl font-bold">3</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
