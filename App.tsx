
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
    
    if (!process.env.API_KEY) {
      setError("환경 설정에서 API 키를 확인해주세요.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchRestaurants();
      setData(result);
    } catch (err: any) {
      console.error("Data loading error:", err);
      setError("가산디지털단지 맛집 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-40 fade-in font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-[1000] text-slate-900 tracking-tighter leading-none">
            <span className="text-blue-600">가산</span> 미식 가이드
          </h1>
          <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Gasan Digital Gourmet
          </p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-2xl active:scale-90 transition-all disabled:opacity-50 hover:bg-slate-200"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <main className="px-5 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-900 font-black text-xl">구글 맵에서 찾는 중...</p>
              <p className="text-slate-400 text-sm font-bold mt-2 text-center leading-relaxed">
                가디역 주변 직장인들의 <br/>찐맛집 데이터를 수집하고 있습니다.
              </p>
            </div>
            <SkeletonLoader />
          </div>
        ) : error ? (
          <div className="text-center py-20 px-8 bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-50">
            <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-3">연결 실패</h2>
            <p className="text-slate-500 text-sm mb-8 font-bold">{error}</p>
            <button onClick={loadData} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black active:scale-95 transition-all">재시도</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg">MAPS</span>
                <span className="text-[13px] font-black text-slate-800 tracking-tight">가산디지털단지역 추천 장소</span>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">{data?.lastUpdated}</span>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 leading-relaxed text-slate-700 font-medium whitespace-pre-wrap text-[15px]">
              {data?.content}
            </div>

            {data?.sources && data.sources.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Google Maps 실시간 링크</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {data.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-blue-100 transition-all active:scale-[0.98]"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[80%]">
                        <span className="text-[14px] font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">{source.title}</span>
                        <span className="text-[11px] text-slate-400 font-bold truncate">{source.uri}</span>
                      </div>
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/95 backdrop-blur-xl text-white px-7 py-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(30,58,138,0.3)] flex items-center justify-between z-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">Gasan Digital Area</span>
          </div>
          <span className="text-[14px] font-black tracking-tight">가산 맛집 실시간 안내 중</span>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center active:scale-90 transition-all hover:bg-white/20"
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
