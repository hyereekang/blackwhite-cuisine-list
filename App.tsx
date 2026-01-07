
import React, { useState, useEffect } from 'react';
import { getTravelRecommendations } from './services/geminiService';
import { UserPreferences, TravelRecommendationResponse } from './types';
import TravelCard from './components/TravelCard';
import TravelMap from './components/TravelMap';
import SkeletonLoader from './components/SkeletonLoader';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TravelRecommendationResponse | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences>({
    vibe: '',
    budget: '',
    companion: '',
    distance: ''
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPrefs(prev => ({
          ...prev,
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }));
      });
    }
  }, []);

  const handleRecommend = async () => {
    setLoading(true);
    setStep(100);
    try {
      const result = await getTravelRecommendations(prefs);
      setData(result);
    } catch (err) {
      console.error(err);
      alert("추천을 가져오는데 실패했습니다.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'vibe', label: '오늘 어떤 분위기의 여행을 꿈꾸시나요?', options: ['장인 정신이 깃든 로컬 투어', '캐치테이블 핫플 맛집', '조용한 힐링 스테이', '액티브한 도시 탐험'] },
    { key: 'companion', label: '함께하는 소중한 동행은?', options: ['나를 위한 혼행', '설레는 커플 여행', '시끌벅적 친구들과', '따뜻한 가족 여행'] },
    { key: 'distance', label: '어느 정도의 거리가 적당할까요?', options: ['당일치기 근교', '1박 2일 국내', '완전한 일탈, 해외'] }
  ];

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-[#FDFDFF] font-sans pb-20">
      <header className="px-8 py-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-[1000] text-slate-900 tracking-tight leading-none">Wanderer</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Premium AI Curator</p>
          </div>
        </div>
      </header>

      <main className="px-8">
        {step < steps.length ? (
          <section className="fade-in space-y-10">
            <div className="space-y-3">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-100'}`} />
                ))}
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter">
                {steps[step].label}
              </h2>
            </div>
            
            <div className="grid gap-4">
              {steps[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setPrefs(prev => ({ ...prev, [steps[step].key]: option }));
                    if (step === steps.length - 1) handleRecommend();
                    else setStep(step + 1);
                  }}
                  className="w-full text-left px-8 py-6 bg-white border border-slate-100 rounded-[2rem] font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all active:scale-[0.98] shadow-sm group relative overflow-hidden"
                >
                  <div className="relative z-10 flex justify-between items-center">
                    {option}
                    <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-colors"
              >
                Back
              </button>
            )}
          </section>
        ) : (
          <section className="fade-in space-y-10">
            {loading ? (
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto relative">
                     <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">당신만을 위한 지도를 그리는 중...</h3>
                  <p className="text-slate-400 text-sm font-medium italic">"현지 핫플과 교통 정보를 지도에 표시하고 있습니다."</p>
                </div>
                <SkeletonLoader />
              </div>
            ) : (
              <div className="space-y-10">
                {/* 지도 컴포넌트 추가 */}
                {data && <TravelMap sources={data.sources} userLocation={prefs.location} />}

                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                    AI Curation Ready
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 leading-relaxed text-slate-700 font-medium whitespace-pre-wrap text-base">
                      {data?.content}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Verified Links & Maps</h3>
                    <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded-md">{data?.sources.length} Items Found</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data?.sources.map((source, i) => (
                      <TravelCard key={i} source={source} />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setStep(0);
                    setData(null);
                  }}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 active:scale-[0.98] transition-all hover:bg-indigo-600"
                >
                  새로운 여행 시작하기
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
