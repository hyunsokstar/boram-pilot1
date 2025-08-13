export default function MemberPage() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">회원/계약 관리</h2>
                    <p className="text-slate-600 text-lg">회원 정보와 계약 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 회원관리 섹션 */}
                    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-150 border-4 border-blue-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-blue-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                            회원관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">회원 등록</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">회원 조회</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">회원 등급 관리</span>
                            </button>
                        </div>
                    </div>

                    {/* 계약관리 섹션 */}
                    <div className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-150 border-4 border-emerald-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-emerald-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            계약관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">계약 등록</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">계약 조회</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">계약 갱신</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">현황 통계</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-blue-100 mb-2">총 회원 수</h4>
                            <p className="text-3xl font-bold">15,847</p>
                            <div className="mt-2 text-blue-100 text-sm">
                                <span className="inline-flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    +12% 증가
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-emerald-100 mb-2">활성 계약</h4>
                            <p className="text-3xl font-bold">8,932</p>
                            <div className="mt-2 text-emerald-100 text-sm">
                                <span className="inline-flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    +8% 증가
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-amber-100 mb-2">신규 회원</h4>
                            <p className="text-3xl font-bold">156</p>
                            <div className="mt-2 text-amber-100 text-sm">
                                <span className="inline-flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    +23% 증가
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-rose-100 mb-2">만료 예정</h4>
                            <p className="text-3xl font-bold">89</p>
                            <div className="mt-2 text-rose-100 text-sm">
                                <span className="inline-flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    -5% 감소
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
