import { useState, useCallback } from 'react';
import { createDeck, shuffleDeck, dealCards } from '../logic/cards';
import { makeAIDecision } from '../ai/ai';
import { getCardType, canBeat } from '../logic/gameRules';

export function useGame() {
  const [gameState, setGameState] = useState('idle'); // idle, dealing, bidding, playing, finished
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [bottomCards, setBottomCards] = useState([]);
  const [landlord, setLandlord] = useState(null); // 'player' or 'computer'
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [lastPlayedCards, setLastPlayedCards] = useState({ player: [], computer: [] });
  const [selectedCards, setSelectedCards] = useState([]);
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [bidScore, setBidScore] = useState(0);
  const [roundScores, setRoundScores] = useState({ player: 0, computer: 0 });
  const [message, setMessage] = useState('点击开始游戏');
  const [winner, setWinner] = useState(null);
  const [biddingHistory, setBiddingHistory] = useState([]);

  // 初始化游戏
  const initGame = useCallback(() => {
    const deck = shuffleDeck(createDeck());
    const { player1, player2, bottomCards } = dealCards(deck);
    
    setPlayerHand(sortCards(player1));
    setComputerHand(sortCards(player2));
    setBottomCards(bottomCards);
    setLandlord(null);
    setCurrentPlayer(null);
    setLastPlayedCards({ player: [], computer: [] });
    setSelectedCards([]);
    setBidScore(0);
    setRoundScores({ player: 0, computer: 0 });
    setWinner(null);
    setBiddingHistory([]);
    setGameState('bidding');
    setMessage('叫地主阶段开始！');
  }, []);

  // 玩家叫地主
  const playerBid = useCallback((score) => {
    const newHistory = [...biddingHistory, { player: 'player', score }];
    setBiddingHistory(newHistory);
    
    if (score === 3) {
      // 叫3分直接成为地主
      setLandlord('player');
      setCurrentPlayer('player');
      setMessage('你成为地主！');
      setTimeout(() => {
        setGameState('playing');
        setMessage('游戏开始！你的回合');
      }, 1500);
      return;
    }
    
    setBidScore(score);
    
    // 电脑叫地主
    setTimeout(() => {
      const aiBid = aiBidDecision(computerHand.length);
      newHistory.push({ player: 'computer', score: aiBid });
      setBiddingHistory([...newHistory]);
      
      if (aiBid > score) {
        setLandlord('computer');
        setCurrentPlayer('computer');
        setMessage('电脑成为地主！');
        setTimeout(() => {
          // 电脑拿底牌
          const newComputerHand = sortCards([...computerHand, ...bottomCards]);
          setComputerHand(newComputerHand);
          setGameState('playing');
          setMessage('电脑的回合');
          
          // 电脑出牌
          setTimeout(() => {
            computerPlay(newComputerHand, [], newComputerHand, true);
          }, 1000);
        }, 1500);
      } else {
        setMessage('都不叫，重新发牌');
        setTimeout(() => initGame(), 1500);
      }
    }, 1000);
  }, [biddingHistory, computerHand, bottomCards]);

  // 电脑叫地主决策
  function aiBidDecision(handSize) {
    const highCards = playerHand.filter(c => c.value >= 14).length;
    const pairs = countPairs(playerHand);
    
    if (highCards >= 5 || pairs >= 3) return 3;
    if (highCards >= 3 || pairs >= 2) return 2;
    if (highCards >= 1 || pairs >= 1) return 1;
    return 0;
  }

  function countPairs(hand) {
    const groups = {};
    hand.forEach(card => {
      groups[card.value] = (groups[card.value] || 0) + 1;
    });
    return Object.values(groups).filter(count => count >= 2).length;
  }

  // 电脑出牌
  const computerPlay = useCallback((currentHand, lastCards, fullHand, isFirst = false) => {
    if (currentHand.length === 0) {
      setWinner('computer');
      setGameState('finished');
      setMessage('电脑获胜！');
      return;
    }

    const decision = makeAIDecision(currentHand, lastCards, true, scores.player, scores.computer);
    
    if (decision.action === 'pass') {
      setLastPlayedCards(prev => ({ ...prev, computer: [] }));
      setMessage('电脑不出');
      
      // 检查玩家是否也要不出
      if (lastCards.length > 0) {
        setCurrentPlayer('player');
        setMessage('你的回合');
      } else {
        // 重新开始出牌轮
        setCurrentPlayer('player');
        setLastPlayedCards({ player: [], computer: [] });
        setMessage('你的回合');
      }
      return;
    }
    
    const playedCards = decision.cards;
    setLastPlayedCards(prev => ({ ...prev, computer: playedCards }));
    setMessage(`电脑出了 ${playedCards.length} 张牌`);
    
    // 移除出的牌
    const newHand = currentHand.filter(c => !playedCards.includes(c));
    setComputerHand(newHand);
    
    if (newHand.length === 0) {
      setWinner('computer');
      setGameState('finished');
      setMessage('电脑获胜！');
      return;
    }
    
    setCurrentPlayer('player');
    setMessage('你的回合');
  }, [scores]);

  // 玩家出牌
  const playerPlayCards = useCallback(() => {
    if (selectedCards.length === 0) {
      setMessage('请选择要出的牌');
      return;
    }

    const cardType = getCardType(selectedCards);
    if (!cardType) {
      setMessage('选择的牌型不合法');
      return;
    }

    // 检查是否能压制
    const lastCards = lastPlayedCards.computer.length > 0 ? lastPlayedCards.computer : lastPlayedCards.player;
    if (lastCards.length > 0 && !canBeat(selectedCards, lastCards)) {
      setMessage('无法压制上家的牌');
      return;
    }

    // 出牌
    const newHand = playerHand.filter(c => !selectedCards.includes(c));
    setPlayerHand(newHand);
    setLastPlayedCards(prev => ({ ...prev, player: selectedCards }));
    setSelectedCards([]);
    
    if (newHand.length === 0) {
      setWinner('player');
      setGameState('finished');
      setMessage('你获胜！');
      return;
    }

    setCurrentPlayer('computer');
    setMessage('电脑思考中...');

    // 电脑出牌
    setTimeout(() => {
      computerPlay(newHand, selectedCards, [...newHand, ...bottomCards]);
    }, 1000);
  }, [selectedCards, playerHand, lastPlayedCards, computerPlay, bottomCards]);

  // 玩家不出
  const playerPass = useCallback(() => {
    if (lastPlayedCards.computer.length === 0 && lastPlayedCards.player.length === 0) {
      setMessage('你是第一个出牌，不能不出');
      return;
    }

    setLastPlayedCards(prev => ({ ...prev, player: [] }));
    setSelectedCards([]);
    setMessage('你不出了');
    
    // 检查电脑是否也要不出
    if (lastPlayedCards.computer.length === 0) {
      // 重新开始出牌轮
      setCurrentPlayer('player');
      setLastPlayedCards({ player: [], computer: [] });
      setMessage('你的回合');
    } else {
      setCurrentPlayer('computer');
      setMessage('电脑的回合');
      setTimeout(() => {
        computerPlay(computerHand, [], [...computerHand, ...bottomCards]);
      }, 1000);
    }
  }, [lastPlayedCards, computerPlay, computerHand, bottomCards]);

  // 选择/取消选择卡牌
  const toggleCardSelection = useCallback((card) => {
    setSelectedCards(prev => {
      const index = prev.findIndex(c => c.id === card.id);
      if (index >= 0) {
        return prev.filter((_, i) => i !== index);
      } else {
        return [...prev, card];
      }
    });
  }, []);

  // 选择所有卡牌
  const selectAllCards = useCallback(() => {
    setSelectedCards([...playerHand]);
  }, [playerHand]);

  // 取消选择所有卡牌
  const deselectAllCards = useCallback(() => {
    setSelectedCards([]);
  }, []);

  // 获取剩余牌数
  const getRemainingCards = useCallback((player) => {
    if (player === 'player') return playerHand.length;
    if (player === 'computer') return computerHand.length;
    return 0;
  }, [playerHand, computerHand]);

  return {
    gameState,
    playerHand,
    computerHand,
    bottomCards,
    landlord,
    currentPlayer,
    lastPlayedCards,
    selectedCards,
    scores,
    bidScore,
    roundScores,
    message,
    winner,
    biddingHistory,
    initGame,
    playerBid,
    playerPlayCards,
    playerPass,
    toggleCardSelection,
    selectAllCards,
    deselectAllCards,
    getRemainingCards
  };
}

function sortCards(cards) {
  return [...cards].sort((a, b) => a.value - b.value);
}
