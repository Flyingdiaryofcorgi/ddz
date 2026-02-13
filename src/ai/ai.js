import { getCardType, CARD_TYPES, canBeat } from '../logic/gameRules';

// 排序手牌
function sortCards(cards) {
  return [...cards].sort((a, b) => a.value - b.value);
}

// 从手牌中找出所有能压制的组合
export function findValidPlays(hand, lastCards) {
  const validPlays = [];
  
  // 添加不出选项
  validPlays.push({
    cards: [],
    type: 'pass',
    description: '不出'
  });
  
  // 如果没有上次出牌，可以出任意合法牌型
  if (lastCards.length === 0) {
    const allPlays = findAllPossiblePlays(hand);
    return [...validPlays, ...allPlays];
  }
  
  // 找出能压制的牌
  const allPlays = findAllPossiblePlays(hand);
  const beatingPlays = allPlays.filter(play => canBeat(play.cards, lastCards));
  
  return [...validPlays, ...beatingPlays];
}

// 找出所有可能的出牌组合
function findAllPossiblePlays(hand) {
  const plays = [];
  const sorted = sortCards(hand);
  const groups = groupByValue(hand);
  
  // 单张
  sorted.forEach(card => {
    plays.push({
      cards: [card],
      type: 'single',
      description: card.rank + card.suit
    });
  });
  
  // 对子
  Object.values(groups).filter(g => g.length >= 2).forEach(g => {
    for (let i = 0; i <= g.length - 2; i++) {
      plays.push({
        cards: [g[i], g[i + 1]],
        type: 'pair',
        description: `${g[i].rank}对子`
      });
    }
  });
  
  // 三个及三个以上
  Object.values(groups).filter(g => g.length >= 3).forEach(g => {
    plays.push({
      cards: g.slice(0, 3),
      type: 'triple',
      description: `${g[0].rank}三个`
    });
    
    // 三带一
    if (hand.length > 3) {
      const others = hand.filter(c => !g.slice(0, 3).includes(c));
      others.forEach(other => {
        plays.push({
          cards: [...g.slice(0, 3), other],
          type: 'triple_with_single',
          description: `${g[0].rank}三带一`
        });
      });
      
      // 三带一对
      const pairs = Object.values(groups).filter(gr => gr.length >= 2 && gr[0].value !== g[0].value);
      pairs.forEach(pair => {
        plays.push({
          cards: [...g.slice(0, 3), pair[0], pair[1]],
          type: 'triple_with_pair',
          description: `${g[0].rank}三带一对`
        });
      });
    }
  });
  
  // 炸弹
  Object.values(groups).filter(g => g.length === 4).forEach(g => {
    plays.push({
      cards: g,
      type: 'bomb',
      description: `${g[0].rank}炸弹`
    });
  });
  
  // 火箭
  const hasSmallJoker = hand.some(c => c.rank === '小王');
  const hasBigJoker = hand.some(c => c.rank === '大王');
  if (hasSmallJoker && hasBigJoker) {
    const smallJoker = hand.find(c => c.rank === '小王');
    const bigJoker = hand.find(c => c.rank === '大王');
    plays.push({
      cards: [smallJoker, bigJoker],
      type: 'rocket',
      description: '火箭'
    });
  }
  
  return plays;
}

function groupByValue(cards) {
  const groups = {};
  cards.forEach(card => {
    if (!groups[card.value]) {
      groups[card.value] = [];
    }
    groups[card.value].push(card);
  });
  return groups;
}

// AI决策
export function makeAIDecision(hand, lastCards, isLandlord, score, opponentScore) {
  // 如果有上家的出牌，AI必须压制
  if (lastCards.length > 0) {
    const allPlays = findAllPossiblePlays(hand);
    const beatingPlays = allPlays.filter(play => canBeat(play.cards, lastCards));
    
    if (beatingPlays.length > 0) {
      // 选择最小的能压制的牌（贪心策略，节省大牌）
      const selected = beatingPlays.reduce((min, current) => {
        if (min.cards.length === 0) return current;
        const minValue = Math.min(...min.cards.map(c => c.value));
        const currentValue = Math.min(...current.cards.map(c => c.value));
        return currentValue < minValue ? current : min;
      });
      
      return { action: 'play', cards: selected.cards };
    } else {
      // 无法压制，只能 pass
      return { action: 'pass', cards: [] };
    }
  }
  
  // 首次出牌，选择最优策略
  return selectBestFirstPlay(hand, isLandlord);
}

// 首次出牌策略
function selectBestFirstPlay(hand, isLandlord) {
  const groups = groupByValue(hand);
  const sorted = sortCards(hand);
  
  // 如果有炸弹，优先出炸弹
  const bombs = Object.values(groups).filter(g => g.length === 4);
  if (bombs.length > 0) {
    return { action: 'play', cards: bombs[0] };
  }
  
  // 如果有火箭
  const hasSmallJoker = hand.some(c => c.rank === '小王');
  const hasBigJoker = hand.some(c => c.rank === '大王');
  if (hasSmallJoker && hasBigJoker) {
    const smallJoker = hand.find(c => c.rank === '小王');
    const bigJoker = hand.find(c => c.rank === '大王');
    return { action: 'play', cards: [smallJoker, bigJoker] };
  }
  
  // 出最小的单牌
  const smallest = sorted[0];
  
  // 尝试找顺子
  const sequence = findLongestSequence(hand);
  if (sequence && sequence.length >= 5) {
    return { action: 'play', cards: sequence };
  }
  
  // 尝试找连对
  const pairSequence = findLongestPairSequence(hand);
  if (pairSequence && pairSequence.length >= 6) {
    return { action: 'play', cards: pairSequence };
  }
  
  return { action: 'play', cards: [smallest] };
}

// 找最长的顺子
function findLongestSequence(hand) {
  const sorted = sortCards(hand);
  const values = sorted.map(c => c.value).filter(v => v < 15); // 排除2和大小王
  
  let longest = [];
  let current = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] - values[i - 1] === 1) {
      current.push(values[i]);
    } else {
      if (current.length >= 5 && current.length > longest.length) {
        longest = [...current];
      }
      current = [values[i]];
    }
  }
  
  if (current.length >= 5 && current.length > longest.length) {
    longest = current;
  }
  
  if (longest.length < 5) return null;
  
  return sorted.filter(c => longest.includes(c.value));
}

// 找最长的连对
function findLongestPairSequence(hand) {
  const groups = groupByValue(hand);
  const pairs = Object.values(groups).filter(g => g.length >= 2 && g[0].value < 15);
  
  if (pairs.length < 3) return null;
  
  const pairValues = pairs.map(p => p[0].value).sort((a, b) => a - b);
  let longest = [];
  let current = [pairValues[0]];
  
  for (let i = 1; i < pairValues.length; i++) {
    if (pairValues[i] - pairValues[i - 1] === 1) {
      current.push(pairValues[i]);
    } else {
      if (current.length >= 3 && current.length > longest.length) {
        longest = [...current];
      }
      current = [pairValues[i]];
    }
  }
  
  if (current.length >= 3 && current.length > longest.length) {
    longest = current;
  }
  
  if (longest.length < 3) return null;
  
  const result = [];
  longest.forEach(value => {
    result.push(...pairs.find(p => p[0].value === value).slice(0, 2));
  });
  
  return result;
}
