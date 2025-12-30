
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
      setError("실시간 맛집 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFCFB] pb-40 fade-in font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-orange-100 px-6 py-6 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-[1000] text-zinc-900 tracking-tighter leading-none">
            <span className="text-orange-600">성지순례</span> 흑백맛집
          </h1>
          <p className="text-[12px] text-zinc-400 font-bold mt-1 uppercase tracking-wider">Chef Guide Season 2</p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center bg-zinc-100 text-zinc-400 rounded-xl active:scale-90 transition-all disabled:opacity-50"
          aria-label="새로고침"
        >
          <svg className={`w-6 h-6 ${loading ? 'animate-spin text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <main className="px-5 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-orange-100 rounded-full"></div>
                <div className="absolute inset-0 w-14 h-14 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-zinc-900 font-black text-lg mt-6">실시간 검색 중...</p>
              <p className="text-zinc-400 text-xs font-bold mt-2 text-center leading-relaxed">
                넷플릭스 흑백요리사 시즌2 출연진의<br/>
                최신 식당 소식을 구글에서 찾고 있습니다.
              </p>
            </div>
            <SkeletonLoader />
          </div>
        ) : error ? (
          <div className="text-center py-20 px-8 bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-50">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-zinc-900 mb-3">정보 로드 실패</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-bold">{error}</p>
            <button 
              onClick={loadData}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black active:scale-95 transition-all shadow-lg shadow-zinc-200"
            >
              다시 시도하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-zinc-900 text-white text-[10px] font-black rounded-md">LIVE</span>
                <span className="text-[13px] font-black text-zinc-800">성지순례 추천 TOP 10</span>
              </div>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{data?.lastUpdated}</span>
            </div>
            
            {data?.restaurants.map((item) => (
              <RestaurantCard key={item.id} item={item} />
            ))}

            {data?.sources && data.sources.length > 0 && (
              <div className="mt-12 pt-8 pb-10 border-t border-slate-100 px-1">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">데이터 출처 및 근거</p>
                </div>
                <div className="flex flex-col gap-3">
                  {data.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[13px] text-slate-500 hover:text-orange-600 font-bold underline underline-offset-4 decoration-slate-200 transition-all truncate bg-white p-3 rounded-2xl border border-slate-50 shadow-sm"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/95 backdrop-blur-md text-white px-6 py-5 rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between z-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-orange-500 font-black tracking-widest uppercase">Now Updating</span>
          </div>
          <span className="text-[14px] font-black tracking-tight">흑백요리사 2 성지순례 지도</span>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-all hover:bg-white/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default App;
