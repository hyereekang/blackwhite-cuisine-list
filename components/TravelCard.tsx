
import React from 'react';
import { GroundingSource } from '../types';

interface TravelCardProps {
  source: GroundingSource;
}

const TravelCard: React.FC<TravelCardProps> = ({ source }) => {
  const isMap = source.uri.includes('google.com/maps');
  const isReservation = source.uri.includes('catchtable') || source.uri.includes('tabling');

  return (
    <a 
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl border border-slate-100 p-4 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isReservation ? 'bg-rose-50 text-rose-600' : isMap ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {isReservation ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
            {source.title}
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {isReservation ? '실시간 예약 바로가기' : '상세 정보 및 위치 확인'}
          </p>
        </div>
        <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
};

export default TravelCard;
