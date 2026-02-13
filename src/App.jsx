import React from 'react';
import GameBoard from './components/GameBoard';
import { useGame } from './hooks/useGame';

function App() {
  const gameState = useGame();

  return (
    <div className="min-h-screen">
      <GameBoard 
        gameState={gameState}
        message={gameState.message}
        currentPlayer={gameState.currentPlayer}
        landlord={gameState.landlord}
        bidScore={gameState.bidScore}
        winner={gameState.winner}
        roundScores={gameState.roundScores}
      />
    </div>
  );
}

export default App;
