import React from 'react';

export default function StartButton({ onStart, disabled }) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onStart}
        disabled={disabled}
        className={`
          px-12 py-4 rounded-xl font-bold text-2xl transition-all duration-300
          ${!disabled
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl transform hover:scale-105'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
        `}
      >
        🎮 开始游戏
      </button>
      {!disabled && (
        <p className="text-white/70 mt-2 text-sm">点击开始新游戏</p>
      )}
    </div>
  );
}
