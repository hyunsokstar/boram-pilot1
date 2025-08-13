export default function OrganizationPage() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">조직/인사 관리</h2>
                    <p className="text-slate-600 text-lg">조직 구조와 인사 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 조직관리 섹션 */}
                    <div className="bg-gradient-to-br from-violet-50 via-violet-100 to-violet-150 border-4 border-violet-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-violet-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-violet-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                            </div>
                            조직관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-violet-300 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">부서 등록</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-violet-300 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">조직 구성</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-violet-300 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">권한 관리</span>
                            </button>
                        </div>
                    </div>

                    {/* 인사관리 섹션 */}
                    <div className="bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-150 border-4 border-cyan-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-cyan-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-cyan-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                            인사관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">인사 등록</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">직원 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">인사 발령</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">현황 통계</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-violet-100 mb-2">전체 직원 수</h4>
                            <p className="text-3xl font-bold">1,247</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-cyan-100 mb-2">부서 수</h4>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-amber-100 mb-2">신규 입사</h4>
                            <p className="text-3xl font-bold">23</p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-rose-100 mb-2">퇴사 예정</h4>
                            <p className="text-3xl font-bold">5</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
