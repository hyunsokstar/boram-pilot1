export default function HRPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">인사 관리</h1>
            <p className="text-gray-600 mb-6">인사 관련 업무를 위한 페이지입니다.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-purple-500 rounded-lg mr-3">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-purple-900">직원 관리</h3>
                    </div>
                    <p className="text-purple-700 mb-4">직원 정보 및 인사 기록 관리</p>
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded border">직원 등록</div>
                        <div className="p-3 bg-white rounded border">인사 발령</div>
                        <div className="p-3 bg-white rounded border">근태 관리</div>
                    </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-cyan-500 rounded-lg mr-3">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-cyan-900">급여 관리</h3>
                    </div>
                    <p className="text-cyan-700 mb-4">급여 계산 및 지급 관리</p>
                    <div className="space-y-2">
                        <div className="p-3 bg-white rounded border">급여 계산</div>
                        <div className="p-3 bg-white rounded border">상여금 지급</div>
                        <div className="p-3 bg-white rounded border">세무 처리</div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">인사 현황</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-purple-500 text-white p-4 rounded-lg">
                        <div className="text-sm opacity-90">총 직원 수</div>
                        <div className="text-2xl font-bold">247</div>
                        <div className="text-sm opacity-75">+12% 증가</div>
                    </div>
                    <div className="bg-cyan-500 text-white p-4 rounded-lg">
                        <div className="text-sm opacity-90">신규 채용</div>
                        <div className="text-2xl font-bold">18</div>
                        <div className="text-sm opacity-75">이번 달</div>
                    </div>
                    <div className="bg-orange-500 text-white p-4 rounded-lg">
                        <div className="text-sm opacity-90">퇴사자</div>
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-sm opacity-75">-8% 감소</div>
                    </div>
                    <div className="bg-pink-500 text-white p-4 rounded-lg">
                        <div className="text-sm opacity-90">평균 근속</div>
                        <div className="text-2xl font-bold">4.2년</div>
                        <div className="text-sm opacity-75">+0.3년</div>
                    </div>
                </div>
            </div>
        </div>
    );
}