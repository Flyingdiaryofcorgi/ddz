import React from 'react';
import PlayerHand from './PlayerHand';
import ComputerHand from './ComputerHand';
import ActionButtons from './ActionButtons';
import BidButtons from './BidButtons';
import GameInfo from './GameInfo';
import BottomCards from './BottomCards';
import StartButton from './StartButton';
import PokerCard from './PokerCard';
import { getCardType } from '../logic/gameRules';

export default function GameBoard({ 
  gameState, 
  message, 
  currentPlayer, 
  landlord, 
  bidScore, 
  winner, 
  roundScores,
  playerHand,
  computerHand,
  bottomCards,
  lastPlayedCards,
  selectedCards,
  scores,
  biddingHistory,
  initGame,
  playerBid,
  playerPlayCards,
  playerPass,
  toggleCardSelection,
  selectAllCards,
  deselectAllCards,
  getRemainingCards
}) {

  // 判断是否可以出牌
  const canPlay = selectedCards.length > 0 && 
    (lastPlayedCards.computer.length === 0 || lastPlayedCards.player.length === 0 || 
     getCardType(selectedCards) !== null);

  // 判断是否可以选择出牌（能压制）
  const lastCards = lastPlayedCards.computer.length > 0 ? lastPlayedCards.computer : lastPlayedCards.player;
  const canPass = currentPlayer === 'player' && lastCards.length > 0;

  // 获取出的牌类型描述
  const getCardTypeText = (cards) => {
    if (cards.length === 0) return '';
    const type = getCardType(cards);
    if (!type) return '无效牌型';
    
    const typeNames = {
      single: '单张',
      pair: '对子',
      triple: '三张',
      triple_with_single: '三带一',
      triple_with_pair: '三带一对',
      sequence: '顺子',
      pair_sequence: '连对',
      plane: '飞机',
      plane_with_single: '飞机带单',
      plane_with_pair: '飞机带对',
      four_with_two_single: '四带二',
      four_with_two_pair: '四带二对',
      bomb: '炸弹',
      rocket: '火箭'
    };
    
    return typeNames[type.type] || type.type;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-800 to-green-900 flex flex-col">
      {/* 顶部信息 */}
      <div className="flex-1 flex items-center justify-center">
        <GameInfo 
          message={message}
          currentPlayer={currentPlayer}
          landlord={landlord}
          playerScore={scores.player}
          computerScore={scores.computer}
          bidScore={bidScore}
        />
      </div>

      {/* 电脑手牌区域 */}
      <div className="p-4">
        <ComputerHand 
          cardCount={getRemainingCards('computer')}
          lastPlayedCards={lastPlayedCards.player}
        />
      </div>

      {/* 游戏中间区域 */}
      <div className="flex-1 flex items-center justify-center">
        {gameState.gameState === 'idle' && (
          <StartButton onStart={initGame} disabled={false} />
        )}
        
        {gameState.gameState === 'bidding' && (
          <BidButtons 
            onBid={playerBid}
            disabled={currentPlayer !== 'player'}
          />
        )}
        
        {(gameState.gameState === 'playing' || gameState.gameState === 'finished') && (
          <div className="flex gap-16">
            {/* 玩家出的牌 */}
            {lastPlayedCards.player.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-white text-sm mb-2">👤 你的出牌</div>
                <div className="flex gap-1">
                  {lastPlayedCards.player.map((card, index) => (
                    <div key={card.id} style={{ marginLeft: index > 0 ? '-25px' : '0' }}>
                      <PokerCard compact card={card} />
                    </div>
                  ))}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {getCardTypeText(lastPlayedCards.player)}
                </div>
              </div>
            )}
            
            {/* 电脑出的牌 */}
            {lastPlayedCards.computer.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-white text-sm mb-2">🤖 电脑出牌</div>
                <div className="flex gap-1">
                  {lastPlayedCards.computer.map((card, index) => (
                    <div key={card.id} style={{ marginLeft: index > 0 ? '-25px' : '0' }}>
                      <PokerCard compact card={card} />
                    </div>
                  ))}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {getCardTypeText(lastPlayedCards.computer)}
                </div>
              </div>
            )}
          </div>
        )}
        
        {gameState.gameState === 'finished' && winner && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="text-4xl mb-4">
                {winner === 'player' ? '🎉🎉🎉' : '😢😢😢'}
              </div>
              <div className="text-2xl font-bold mb-4">
                {winner === 'player' ? '恭喜你获胜！' : '电脑获胜'}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                最终得分: +{roundScores.player} / -{roundScores.computer}
              </div>
              <StartButton onStart={initGame} disabled={false} />
            </div>
          </div>
        )}
      </div>

      {/* 玩家手牌区域 */}
      <div className="p-4">
        {(gameState.gameState === 'playing' || gameState.gameState === 'finished') && (
          <div className="flex flex-col items-center">
            <PlayerHand 
              cards={playerHand}
              selectedCards={selectedCards}
              onCardClick={toggleCardSelection}
              disabled={currentPlayer !== 'player'}
            />
            
            {currentPlayer === 'player' && (
              <>
                <ActionButtons 
                  onPlay={playerPlayCards}
                  onPass={playerPass}
                  canPlay={canPlay}
                  canPass={canPass}
                  selectedCount={selectedCards.length}
                  disabled={false}
                />
                
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={selectAllCards}
                    className="text-white/70 hover:text-white text-sm underline"
                  >
                    全选
                  </button>
                  <button
                    onClick={deselectAllCards}
                    className="text-white/70 hover:text-white text-sm underline"
                  >
                    取消
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {gameState.gameState === 'idle' && (
          <div className="text-center text-white/50">
            你的手牌将显示在这里
          </div>
        )}
      </div>
    </div>
  );
}
