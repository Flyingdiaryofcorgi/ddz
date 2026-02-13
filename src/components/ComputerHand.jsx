import React from 'react';

export default function ComputerHand({ cardCount, lastPlayedCards }) {
  return (
    <div className="flex flex-col items-center">
      {/* 电脑手牌（背面朝上） */}
      <div className="flex justify-center gap-1 max-w-4xl px-4 py-2">
        {Array.from({ length: Math.min(cardCount, 20) }).map((_, index) => (
          <div
            key={index}
            className="relative"
            style={{ marginLeft: index > 0 ? '-20px' : '0' }}
          >
            <div className="w-16 h-24 rounded-lg border-2 bg-gradient-to-br from-blue-600 to-blue-800 shadow-md flex items-center justify-center">
              <div className="w-12 h-20 rounded border border-yellow-400/50" />
            </div>
          </div>
        ))}
        {cardCount > 20 && (
          <div className="flex items-center ml-2 text-white text-lg font-bold">
            +{cardCount - 20}
          </div>
        )}
      </div>
      
      {/* 剩余牌数 */}
      <div className="text-white text-lg font-semibold bg-blue-600 px-4 py-1 rounded-full mt-2">
        电脑: {cardCount}张
      </div>
      
      {/* 刚出的牌 */}
      {lastPlayedCards.length > 0 && (
        <div className="mt-2 flex gap-1">
          {lastPlayedCards.slice(0, 8).map((card, index) => (
            <div
              key={card.id}
              className="relative"
              style={{ marginLeft: index > 0 ? '-25px' : '0' }}
            >
              <div className="w-10 h-14 rounded border bg-white flex items-center justify-center text-xs">
                <span className={card.isRed || card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>
                  {card.rank}{card.suit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
