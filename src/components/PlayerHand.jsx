import React from 'react';
import PokerCard from './PokerCard';

export default function PlayerHand({ cards, selectedCards, onCardClick, disabled }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-1 max-w-4xl px-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="relative"
            style={{ marginLeft: index > 0 ? '-8px' : '0' }}
          >
            <PokerCard
              card={card}
              selected={selectedCards.some(c => c.id === card.id)}
              onClick={disabled ? undefined : () => onCardClick(card)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
