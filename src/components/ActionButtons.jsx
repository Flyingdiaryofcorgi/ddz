import React from 'react';

export default function ActionButtons({ 
  onPlay, 
  onPass, 
  canPlay, 
  canPass, 
  selectedCount,
  disabled 
}) {
  return (
    <div className="flex gap-4 justify-center mt-4">
      <button
        onClick={onPlay}
        disabled={!canPlay || disabled}
        className={`
          px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200
          ${canPlay && !disabled
            ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg transform hover:scale-105'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
        `}
      >
        出牌 {selectedCount > 0 && `(${selectedCount})`}
      </button>
      
      <button
        onClick={onPass}
        disabled={!canPass || disabled}
        className={`
          px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200
          ${canPass && !disabled
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
        `}
      >
        不出
      </button>
    </div>
  );
}
