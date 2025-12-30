import React, { useState, useEffect, useCallback } from 'react';
import { fetchRestaurants } from './services/geminiService';
import { RestaurantResponse } from './types';
import RestaurantCard from './components/NewsCard';
import SkeletonLoader from './components/SkeletonLoader';

const App: React.FC = () => {
  const [data, setData] = useState<RestaurantResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRestaurants();
      setData(result);
    } catch (err: any) {
      console.error("Data loading error:", err);
      if (err.message === "API_KEY_MISSING") {
        setError("API_KEY가 환경 변수에 설정되지 않았습니다. 앱 설정이나 배포 환경을 확인해 주세요.");
      } else if (err.message.includes("403") || err.message.includes("permission")) {
        setError("API 접근 권한이 없거나 키가 올바르지 않습니다.");
      } else {
        setError("정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFCFB] pb-40 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 px-6 py-6 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-[26px] font-[1000] text-zinc-900 tracking-tighter flex items-center gap-2 leading-none">
            <span className="text-orange-600">성지순례</span>흑백<span className="text-orange-600">맛집</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              Live Tracker
            </div>
            <p className="text-[12px] text-slate-500 font-bold">
              시즌2 출연진 식당 가이드
            </p>
          </div>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-400 rounded-2xl transition-all active:scale-90 shadow-sm disabled:opacity-50"
          title="새로고침"
        >
          <svg className={`w-7 h-7 ${loading ? 'animate-spin text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="px-5 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-[6px] border-orange-50 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-900 font-black text-xl tracking-tight">최신 맛집 검색 중...</p>
              <p className="text-slate-400 font-bold text-sm mt-2 tracking-tight">구글 검색으로 정보를 수집하고 있습니다</p>
            </div>
            <SkeletonLoader />
          </div>
        ) : error ? (
          <div className="text-center py-20 px-10 bg-white rounded-[3rem] shadow-xl border border-red-100">
            <div className="text-7xl mb-8">👨‍🍳</div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">문제가 발생했습니다</h2>
            <p className="text-slate-500 font-bold text-base mb-10 leading-relaxed px-4">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={loadData}
                className="w-full py-5 bg-orange-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-orange-200 active:scale-95 transition-all hover:bg-orange-700"
              >
                다시 시도하기
              </button>
            </div>
          </div>
        ) : (
          <div className="fade-in space-y-2">
            <div className="flex items-center justify-between px-1 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xs font-black">TOP</span>
                </div>
                <div>
                  <h2 className="text-[15px] font-black text-slate-800 leading-tight">실시간 셰프 맛집 리스트</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Search Grounding Active</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black text-orange-600 block">{data?.lastUpdated}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {data?.restaurants.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">검색된 정보가 없습니다.</p>
                </div>
              ) : (
                data?.restaurants.map((item) => (
                  <RestaurantCard key={item.id} item={item} />
                ))
              )}
            </div>

            {/* Information Footer */}
            <div className="mt-16 mb-12 p-8 bg-zinc-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-lg">!</div>
                <h3 className="text-lg font-black italic">안내사항</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8 relative">
                이 정보는 Google Search Grounding을 통해 실시간으로 검색된 결과입니다. 셰프들의 실제 식당 운영 여부와 예약 방식은 변동될 수 있으므로 반드시 네이버 지도를 통해 재확인하시기 바랍니다.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-zinc-900/95 backdrop-blur-3xl border border-white/10 px-7 py-6 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-between z-50 transition-all">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            <span className="text-[11px] text-orange-500 font-black tracking-widest uppercase">
              Now Curating
            </span>
          </div>
          <span className="text-[15px] font-black text-white tracking-tight">흑백요리사 2 성지순례 가이드</span>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default App;