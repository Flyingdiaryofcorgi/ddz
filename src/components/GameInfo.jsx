import React from 'react';

export default function GameInfo({ 
  message, 
  currentPlayer, 
  landlord, 
  playerScore,
  computerScore,
  bidScore
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-white">
      <div className="text-2xl font-bold bg-black/50 px-6 py-2 rounded-lg">
        {message}
      </div>
      
      <div className="flex gap-8 text-lg">
        <div className={`px-4 py-2 rounded ${currentPlayer === 'player' ? 'bg-green-500' : 'bg-gray-500/50'}`}>
          👤 你 {landlord === 'player' && '🏠地主'}
        </div>
        <div className={`px-4 py-2 rounded ${currentPlayer === 'computer' ? 'bg-green-500' : 'bg-gray-500/50'}`}>
          🤖 电脑 {landlord === 'computer' && '🏠地主'}
        </div>
      </div>
      
      <div className="flex gap-8 text-base bg-black/30 px-4 py-1 rounded">
        <span>🀄 底分: {bidScore}</span>
        <span>👤 分数: {playerScore}</span>
        <span>🤖 分数: {computerScore}</span>
      </div>
    </div>
  );
}
