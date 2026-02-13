import { getCardType, canBeat, CARD_TYPES } from '../logic/gameRules';

// 排序手牌
function sortCards(cards) {
  return [...cards].sort((a, b) => a.value - b.value);
}

// 按花色排序（用于显示）
function sortCardsByRank(cards) {
  return [...cards].sort((a, b) => {
    if (a.value !== b.value) return b.value - a.value; // 从大到小
    const suitOrder = { '♠': 4, '♥': 3, '♦': 2, '♣': 1 };
    return (suitOrder[b.suit] || 0) - (suitOrder[a.suit] || 0);
  });
}

// 按手牌数量决定策略
function getStrategy(myHandCount, opponentHandCount) {
  if (myHandCount <= 3) return 'aggressive'; // 手牌少，激进
  if (opponentHandCount <= 3) return 'aggressive'; // 对方手牌少，要快
  if (myHandCount >= 15) return 'conservative'; // 手牌多，保守
  return 'balanced'; // 均衡
}

// 找出所有可能的出牌组合
function findAllPlays(hand) {
  const plays = [];
  const sorted = sortCards(hand);
  const groups = {};
  
  // 按点数分组
  hand.forEach(card => {
    if (!groups[card.value]) groups[card.value] = [];
    groups[card.value].push(card);
  });
  
  // 1. 单张
  sorted.forEach(card => {
    plays.push({ cards: [card], type: 'single', strength: card.value });
  });
  
  // 2. 对子
  Object.values(groups).filter(g => g.length >= 2).forEach(g => {
    for (let i = 0; i <= g.length - 2; i++) {
      plays.push({ 
        cards: [g[i], g[i+1]], 
        type: 'pair', 
        strength: g[i].value 
      });
    }
  });
  
  // 3. 三个
  Object.values(groups).filter(g => g.length >= 3).forEach(g => {
    plays.push({ cards: g.slice(0, 3), type: 'triple', strength: g[0].value });
    
    // 三带一
    const others = hand.filter(c => !g.slice(0, 3).includes(c));
    others.forEach(other => {
      plays.push({ 
        cards: [...g.slice(0, 3), other], 
        type: 'triple_with_single', 
        strength: g[0].value 
      });
    });
    
    // 三带一对
    const pairs = Object.values(groups).filter(gr => gr.length >= 2 && gr[0].value !== g[0].value);
    pairs.forEach(pair => {
      plays.push({ 
        cards: [...g.slice(0, 3), pair[0], pair[1]], 
        type: 'triple_with_pair', 
        strength: g[0].value 
      });
    });
  });
  
  // 4. 顺子 (5张以上连续)
  const singles = sorted.filter(c => c.value < 15); // 排除2和大小王
  const sequences = findSequences(singles.map(c => c.value), 5);
  sequences.forEach(seq => {
    plays.push({ 
      cards: seq.map(v => singles.find(c => c.value === v)), 
      type: 'sequence', 
      strength: Math.max(...seq) 
    });
  });
  
  // 5. 连对 (3对以上连续)
  const pairs = Object.values(groups).filter(g => g.length >= 2 && g[0].value < 15);
  const pairSequences = findPairSequences(pairs.map(g => g[0].value), 3);
  pairSequences.forEach(seq => {
    const cards = [];
    seq.forEach(v => {
      cards.push(...groups[v].slice(0, 2));
    });
    plays.push({ cards, type: 'pair_sequence', strength: Math.max(...seq) });
  });
  
  // 6. 飞机 (2个以上连续三张)
  const triples = Object.values(groups).filter(g => g.length >= 3 && g[0].value < 15);
  const tripleSequences = findTripleSequences(triples.map(g => g[0].value), 2);
  tripleSequences.forEach(seq => {
    const cards = [];
    seq.forEach(v => cards.push(...groups[v].slice(0, 3)));
    plays.push({ cards, type: 'plane', strength: Math.max(...seq) });
  });
  
  // 7. 炸弹
  Object.values(groups).filter(g => g.length === 4).forEach(g => {
    plays.push({ cards: g, type: 'bomb', strength: g[0].value + 100 }); // 炸弹权重高
  });
  
  // 8. 火箭
  const hasSmallJoker = hand.some(c => c.rank === '小王');
  const hasBigJoker = hand.some(c => c.rank === '大王');
  if (hasSmallJoker && hasBigJoker) {
    plays.push({ 
      cards: [hand.find(c => c.rank === '小王'), hand.find(c => c.rank === '大王')], 
      type: 'rocket', 
      strength: 200 
    });
  }
  
  return plays;
}

// 找顺子
function findSequences(values, minLength) {
  if (values.length < minLength) return [];
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  const result = [];
  let current = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i-1] === 1) {
      current.push(sorted[i]);
    } else {
      if (current.length >= minLength) result.push([...current]);
      current = [sorted[i]];
    }
  }
  if (current.length >= minLength) result.push(current);
  
  return result;
}

// 找连对
function findPairSequences(values, minLength) {
  return findSequences(values, minLength);
}

// 找飞机
function findTripleSequences(values, minLength) {
  return findSequences(values, minLength);
}

// AI决策
export function makeAIDecision(hand, lastCards, isLandlord, myScore, opponentScore) {
  const myHandCount = hand.length;
  const strategy = getStrategy(myHandCount, lastCards.length > 0 ? lastCards.length : 8);
  
  // 如果有上家的出牌，必须压制
  if (lastCards.length > 0) {
    const allPlays = findAllPlays(hand);
    const beatingPlays = allPlays.filter(play => canBeat(play.cards, lastCards));
    
    if (beatingPlays.length > 0) {
      // 根据策略选择
      if (strategy === 'aggressive') {
        // 激进：选择最快的出牌方式
        const fastest = beatingPlays.reduce((best, current) => {
          return current.cards.length > best.cards.length ? current : best;
        });
        return { action: 'play', cards: fastest.cards, reason: '激进出牌' };
      } else {
        // 保守：选择最小的能压制的牌
        const cheapest = beatingPlays.reduce((best, current) => {
          const bestStrength = Math.min(...best.cards.map(c => c.value));
          const currentStrength = Math.min(...current.cards.map(c => c.value));
          return currentStrength < bestStrength ? current : best;
        });
        return { action: 'play', cards: cheapest.cards, reason: '保守压制' };
      }
    } else {
      return { action: 'pass', cards: [], reason: '无法压制' };
    }
  }
  
  // 首次出牌：分析局面选择最优策略
  const allPlays = findAllPlays(hand);
  
  // 按出牌数量排序（优先出完手牌）
  const sortedByCount = [...allPlays].sort((a, b) => b.cards.length - a.cards.length);
  
  // 找出能一次出最多牌的组合
  const maxPlay = sortedByCount[0];
  
  // 策略1：手牌多时，先出单张引对手
  if (strategy === 'conservative' || myHandCount > 12) {
    const singles = allPlays.filter(p => p.type === 'single');
    if (singles.length > 0) {
      // 出最大的单张，引对手用大牌
      const biggestSingle = singles.reduce((best, current) => {
        return current.cards[0].value > best.cards[0].value ? current : best;
      });
      return { action: 'play', cards: biggestSingle.cards, reason: '保守策略-单张试探' };
    }
  }
  
  // 策略2：有炸弹/火箭时，优先用
  const bombsAndRockets = allPlays.filter(p => p.type === 'bomb' || p.type === 'rocket');
  if (bombsAndRockets.length > 0 && (strategy === 'aggressive' || myHandCount <= 5)) {
    return { action: 'play', cards: bombsAndRockets[0].cards, reason: '使用炸弹/火箭' };
  }
  
  // 策略3：激进出牌，一次出最多
  if (strategy === 'aggressive') {
    return { action: 'play', cards: maxPlay.cards, reason: '激进-一次出完' };
  }
  
  // 策略4：均衡策略
  // 优先：顺子 > 连对 > 飞机 > 三张 > 对子 > 单张
  const priority = ['sequence', 'pair_sequence', 'plane', 'triple_with_single', 'triple_with_pair', 'triple', 'pair', 'single'];
  for (const type of priority) {
    const plays = allPlays.filter(p => p.type === type);
    if (plays.length > 0) {
      // 选择最大的
      const best = plays.reduce((a, b) => a.strength > b.strength ? a : b);
      return { action: 'play', cards: best.cards, reason: `优先${type}` };
    }
  }
  
  return { action: 'play', cards: maxPlay.cards, reason: '默认出最多' };
}

// 叫地主决策
export function makeBidDecision(hand) {
  const sorted = sortCards(hand);
  const groups = {};
  hand.forEach(card => {
    if (!groups[card.value]) groups[card.value] = [];
    groups[card.value].push(card);
  });
  
  // 计算好牌数量
  const highCards = hand.filter(c => c.value >= 14).length; // A以上的牌
  const pairs = Object.values(groups).filter(g => g.length >= 2).length;
  const triples = Object.values(groups).filter(g => g.length >= 3).length;
  const bombs = Object.values(groups).filter(g => g.length === 4).length;
  const hasRocket = hand.some(c => c.rank === '小王') && hand.some(c => c.rank === '大王');
  
  // 好牌数量
  const goodCards = highCards + pairs * 2 + triples * 3 + bombs * 4 + (hasRocket ? 4 : 0);
  
  if (goodCards >= 8) return 3; // 好牌多，叫3分
  if (goodCards >= 5) return 2; // 好牌不错，叫2分
  if (goodCards >= 3) return 1; // 一般，叫1分
  return 0; // 不叫
}
