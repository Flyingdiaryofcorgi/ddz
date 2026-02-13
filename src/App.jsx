import React from 'react';
import GameBoard from './components/GameBoard';
import { useGame } from './hooks/useGame';

function App() {
  const gameState = useGame();

  return (
    <div className="min-h-screen">
      <GameBoard 
        gameState={gameState.gameState}
        message={gameState.message}
        currentPlayer={gameState.currentPlayer}
        landlord={gameState.landlord}
        bidScore={gameState.bidScore}
        winner={gameState.winner}
        roundScores={gameState.roundScores}
        playerHand={gameState.playerHand}
        computerHand={gameState.computerHand}
        bottomCards={gameState.bottomCards}
        lastPlayedCards={gameState.lastPlayedCards}
        selectedCards={gameState.selectedCards}
        scores={gameState.scores}
        biddingHistory={gameState.biddingHistory}
        initGame={gameState.initGame}
        playerBid={gameState.playerBid}
        playerPlayCards={gameState.playerPlayCards}
        playerPass={gameState.playerPass}
        toggleCardSelection={gameState.toggleCardSelection}
        selectAllCards={gameState.selectAllCards}
        deselectAllCards={gameState.deselectAllCards}
        getRemainingCards={gameState.getRemainingCards}
      />
    </div>
  );
}

export default App;
