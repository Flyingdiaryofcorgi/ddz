import React from 'react';
import PokerCard from './PokerCard';

export default function BottomCards({ cards, landlord }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-white text-lg font-semibold mb-2">
        底牌 {landlord && <span className="text-yellow-400">（地主获得）</span>}
      </div>
      <div className="flex gap-2">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="relative"
            style={{ marginLeft: index > 0 ? '-30px' : '0' }}
          >
            <PokerCard card={card} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
