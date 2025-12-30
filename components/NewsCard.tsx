
import React, { useState } from 'react';
import { RestaurantItem } from '../types';
import KeywordBadge from './KeywordBadge';

interface RestaurantCardProps {
  item: RestaurantItem;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const chefTypeConfig = item.chefType === 'WHITE' 
    ? { label: '백수저', bg: 'bg-white', text: 'text-slate-800', border: 'border-slate-300' }
    : { label: '흑수저', bg: 'bg-zinc-900', text: 'text-white', border: 'border-zinc-800' };

  return (
    <div 
      className={`bg-white rounded-[2rem] mb-5 shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-4 ring-orange-500/10 shadow-xl border-orange-200' : 'hover:border-slate-300'}`}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 flex flex-col gap-4 outline-none active:bg-slate-50 transition-colors"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className={`${chefTypeConfig.bg} ${chefTypeConfig.text} text-[11px] font-black px-3 py-1 rounded-full border ${chefTypeConfig.border} shadow-sm uppercase tracking-wider`}>
              {chefTypeConfig.label}
            </span>
            <span className="text-[12px] text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg">
              {item.location}
            </span>
          </div>
          <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-[26px] font-[1000] text-slate-900 leading-[1.1] mb-1 tracking-tighter">
            {item.name}
          </h2>
          <p className="text-orange-600 font-black text-[18px]">
            {item.chef} <span className="text-slate-400 font-bold text-sm ml-1">Chef</span>
          </p>
        </div>

        {!isExpanded && (
          <div className="flex flex-wrap gap-2">
            {item.keywords.slice(0, 3).map((kw, i) => (
              <span key={i} className="text-[14px] font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                #{kw.replace('#', '')}
              </span>
            ))}
          </div>
        )}
      </button>

      <div 
        className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="px-6 pb-8 pt-2 border-t border-slate-50">
          <div className="bg-orange-50 rounded-[1.5rem] p-6 mb-6">
            <div className="mb-5">
              <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1.5">Main Specialty</p>
              <p className="text-slate-900 text-[22px] font-black leading-tight">
                {item.specialty}
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100/50">
              <p className="text-slate-700 font-bold text-[17px] leading-relaxed mb-4">
                "{item.description}"
              </p>
              <div className="flex items-start gap-2 text-[13px] text-slate-500 font-bold leading-snug">
                <svg className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {item.location}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {item.keywords.map((kw, idx) => (
              <KeywordBadge key={idx} text={kw.replace('#', '')} />
            ))}
          </div>

          <a 
            href={item.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-5 bg-[#03C75A] hover:bg-[#02b351] text-white rounded-[1.5rem] font-black text-xl transition-all shadow-xl shadow-green-100 active:scale-[0.97]"
          >
            <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span>네이버 지도로 예약/확인</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
