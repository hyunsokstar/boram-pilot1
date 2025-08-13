export default function CRMPage() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">CRM 관리</h2>
                    <p className="text-slate-600 text-lg">고객 관계 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 고객관리 섹션 */}
                    <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-150 border-4 border-purple-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-purple-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-purple-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a1 1 0 00.553-.894l2-1A1 1 0 015 6h2a1 1 0 01.447.106l2 1z" />
                                </svg>
                            </div>
                            고객관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">고객 정보</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">고객 분류</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">상담 내역</span>
                            </button>
                        </div>
                    </div>

                    {/* 마케팅 섹션 */}
                    <div className="bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-150 border-4 border-cyan-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-cyan-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-cyan-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            마케팅
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">캠페인 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">이메일 발송</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">성과 분석</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">고객 현황</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-purple-100 mb-2">총 고객 수</h4>
                            <p className="text-3xl font-bold">24,847</p>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-cyan-100 mb-2">활성 고객</h4>
                            <p className="text-3xl font-bold">18,932</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-yellow-100 mb-2">진행 캠페인</h4>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-rose-100 mb-2">전환율</h4>
                            <p className="text-3xl font-bold">15.8%</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
