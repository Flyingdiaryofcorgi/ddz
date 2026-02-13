import React from 'react';

export default function BidButtons({ onBid, disabled }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-white text-xl font-bold">请叫地主</div>
      <div className="flex gap-4">
        {[1, 2, 3].map(score => (
          <button
            key={score}
            onClick={() => onBid(score)}
            disabled={disabled}
            className={`
              px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200
              ${!disabled
                ? score === 3 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
            `}
          >
            叫{score}分
          </button>
        ))}
        <button
          onClick={() => onBid(0)}
          disabled={disabled}
          className={`
            px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200
            ${!disabled
              ? 'bg-gray-500 hover:bg-gray-600 text-white shadow-lg'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
          `}
        >
          不叫
        </button>
      </div>
    </div>
  );
}
