
import React from 'react';

interface KeywordBadgeProps {
  text: string;
}

const KeywordBadge: React.FC<KeywordBadgeProps> = ({ text }) => {
  return (
    <span className="inline-block bg-white text-orange-600 px-3.5 py-2 rounded-xl text-sm font-black mr-2 mb-2 border border-orange-100 shadow-sm">
      #{text}
    </span>
  );
};

export default KeywordBadge;
