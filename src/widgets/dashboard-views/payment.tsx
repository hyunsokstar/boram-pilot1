"use client";

import React from 'react';

export function PaymentView() {
    return (
        <section className="flex-1 p-8 bg-slate-50">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="border-b border-slate-200 pb-6 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">수납 관리</h2>
                    <p className="text-slate-600 text-lg">수납 및 결제 관리를 위한 페이지입니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-150 border-4 border-indigo-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-indigo-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </div>
                            수납관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">수납 등록</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">수납 조회</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">미수금 관리</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 via-teal-100 to-teal-150 border-4 border-teal-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-teal-200/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="p-3 bg-teal-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            결제관리
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">결제 내역</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">환불 처리</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-white border-3 border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <span className="font-semibold text-slate-700">정산 관리</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">현황 통계</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-indigo-100 mb-2">오늘 수납액</h4>
                            <p className="text-3xl font-bold">₩2,150,000</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-teal-100 mb-2">이번 달 수납</h4>
                            <p className="text-3xl font-bold">₩45,680,000</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-amber-100 mb-2">미수금</h4>
                            <p className="text-3xl font-bold">₩3,240,000</p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <h4 className="text-sm font-medium text-rose-100 mb-2">환불 대기</h4>
                            <p className="text-3xl font-bold">₩180,000</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
