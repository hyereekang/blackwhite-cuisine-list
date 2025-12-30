
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div>
          <div className="h-8 w-full bg-slate-200 rounded mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-8 w-16 bg-slate-200 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="h-20 w-full bg-slate-100 rounded mb-4"></div>
          <div className="h-10 w-full bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
