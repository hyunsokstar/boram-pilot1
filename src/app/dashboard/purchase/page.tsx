export default function PurchasePage() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">구매/재고 관리</h2>
                    <p className="text-slate-600 text-lg">구매 및 재고 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 구매관리 섹션 */}
                    <div className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-150 border-4 border-emerald-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-emerald-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                                </svg>
                            </div>
                            구매관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">구매 요청</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">발주 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">공급업체 관리</span>
                            </button>
                        </div>
                    </div>

                    {/* 재고관리 섹션 */}
                    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-150 border-4 border-blue-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-blue-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            재고관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">재고 조회</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">입출고 관리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">재고 실사</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 정보 */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">재고 현황</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-emerald-100 mb-2">총 품목 수</h4>
                            <p className="text-3xl font-bold">1,456</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-blue-100 mb-2">재고 가치</h4>
                            <p className="text-3xl font-bold">₩85.4M</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-yellow-100 mb-2">부족 품목</h4>
                            <p className="text-3xl font-bold">23</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-red-100 mb-2">과재고 품목</h4>
                            <p className="text-3xl font-bold">12</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
