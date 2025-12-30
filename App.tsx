
import React, { useState, useEffect, useCallback } from 'react';
import { fetchRestaurants } from './services/geminiService';
import { RestaurantResponse } from './types';
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
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32 fade-in font-sans">
      <header className="sticky top-0 z-50 glass border-b border-slate-200/60 px-6 py-5 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-xl font-[1000] text-slate-900 tracking-tight leading-none">
            가산 <span className="text-blue-600">미식 가이드</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            Offline Curated Edition
          </p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl active:scale-90 transition-all disabled:opacity-50 hover:bg-blue-50 hover:text-blue-600"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <main className="px-5 pt-6 space-y-8">
        {loading ? (
          <div className="space-y-6">
            <div className="py-12 px-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-slate-900 font-black text-lg">맛집 정보 로딩 중</h3>
              <p className="text-slate-400 text-xs font-bold mt-1">가디역 최고 인기 장소들을 정리하고 있습니다.</p>
            </div>
            <SkeletonLoader />
          </div>
        ) : error ? (
          <div className="py-12 px-8 bg-white rounded-3xl border border-red-50 shadow-sm text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-800 font-bold mb-4">{error}</p>
            <button onClick={loadData} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black active:scale-95 transition-all">다시 시도</button>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md border border-blue-100">GASAN HOTSPOTS</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data?.lastUpdated}</span>
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 text-[14px] leading-relaxed whitespace-pre-wrap font-medium">
                {data?.content}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1 mb-1">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">구글 지도에서 위치 보기</h2>
              </div>

              <div className="grid gap-3">
                {data?.sources && data.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-[15px] font-[900] text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {source.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                        <span className="text-blue-500 font-black">Google Maps</span>에서 길찾기
                      </p>
                    </div>
                    <div className="shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent">
        <div className="max-w-md mx-auto bg-slate-900 text-white rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-2xl shadow-blue-900/20 border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">Gasan Navigator</span>
            <span className="text-[13px] font-bold">오프라인 가이드 모드</span>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
