import React from 'react';

export default function PokerCard({ card, selected, onClick, disabled, compact = false }) {
  const isRed = card.isRed || card.suit === '♥' || card.suit === '♦';
  
  if (compact) {
    return (
      <div
        onClick={disabled ? undefined : () => onClick && onClick(card)}
        className={`
          relative w-8 h-12 rounded border-2 cursor-pointer select-none transition-all duration-150
          ${selected ? '-translate-y-4 shadow-lg' : 'translate-y-0'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          bg-white border-gray-300
        `}
      >
        <div className={`absolute top-1 left-1 text-xs ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`absolute bottom-1 right-1 text-xs ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={disabled ? undefined : () => onClick && onClick(card)}
      className={`
        relative w-16 h-24 rounded-lg border-2 cursor-pointer select-none transition-all duration-150
        ${selected ? '-translate-y-6 shadow-xl' : 'translate-y-0'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        bg-white border-gray-300
      `}
    >
      {/* 左上角 */}
      <div className="absolute top-1.5 left-2 flex flex-col items-center">
        <span className={`text-lg font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </span>
        <span className={`text-xl leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </span>
      </div>
      
      {/* 中间大图标 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className={`text-4xl ${isRed ? 'text-red-500' : 'text-black'}`}>
          {card.suit}
        </span>
      </div>
      
      {/* 右下角（旋转180度） */}
      <div className="absolute bottom-1.5 right-2 flex flex-col items-center transform rotate-180">
        <span className={`text-lg font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </span>
        <span className={`text-xl leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </span>
      </div>
    </div>
  );
}
