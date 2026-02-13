import { RANK_VALUES } from './cards';

// 牌型定义
export const CARD_TYPES = {
  SINGLE: 'single',           // 单张
  PAIR: 'pair',               // 对子
  TRIPLE: 'triple',           // 三个
  TRIPLE_WITH_SINGLE: 'triple_with_single',     // 三带一
  TRIPLE_WITH_PAIR: 'triple_with_pair',         // 三带一对
  SEQUENCE: 'sequence',       // 顺子
  PAIR_SEQUENCE: 'pair_sequence', // 连对
  PLANE: 'plane',             // 飞机（连续三个）
  PLANE_WITH_SINGLE: 'plane_with_single',       // 飞机带单牌
  PLANE_WITH_PAIR: 'plane_with_pair',           // 飞机带对子
  FOUR_WITH_TWO_SINGLE: 'four_with_two_single', // 四带二（单）
  FOUR_WITH_TWO_PAIR: 'four_with_two_pair',     // 四带二（对）
  BOMB: 'bomb',               // 炸弹
  ROCKET: 'rocket'            // 火箭（大小王）
};

// 获取牌的主值（用于排序）
function getCardValue(card) {
  return card.value;
}

// 按值分组
function groupByValue(cards) {
  const groups = {};
  cards.forEach(card => {
    const value = getCardValue(card);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(card);
  });
  return groups;
}

// 按组大小排序（用于分析牌型）
function getGroupsBySize(groups) {
  const result = [];
  Object.entries(groups).forEach(([value, cards]) => {
    result.push({
      value: parseInt(value),
      cards,
      size: cards.length
    });
  });
  return result.sort((a, b) => a.value - b.value);
}

// 判断单张
export function isSingle(cards) {
  return cards.length === 1;
}

// 判断对子
export function isPair(cards) {
  if (cards.length !== 2) return false;
  return cards[0].value === cards[1].value;
}

// 判断三个
export function isTriple(cards) {
  if (cards.length !== 3) return false;
  return cards[0].value === cards[1].value && cards[1].value === cards[2].value;
}

// 判断三带一
export function isTripleWithSingle(cards) {
  if (cards.length !== 4) return false;
  const groups = groupByValue(cards);
  const sizes = Object.values(groups).map(g => g.length);
  return sizes.includes(3) && sizes.includes(1);
}

// 判断三带一对
export function isTripleWithPair(cards) {
  if (cards.length !== 5) return false;
  const groups = groupByValue(cards);
  const sizes = Object.values(groups).map(g => g.length);
  return sizes.includes(3) && sizes.includes(2);
}

// 判断顺子（5张以上连续单牌，2不能加入顺子）
export function isSequence(cards) {
  if (cards.length < 5) return false;
  const values = cards.map(getCardValue).sort((a, b) => a - b);
  
  // 不能包含2和大小王
  if (values.some(v => v >= 15)) return false;
  
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] - values[i] !== 1) return false;
  }
  return true;
}

// 判断连对（至少3对）
export function isPairSequence(cards) {
  if (cards.length < 6 || cards.length % 2 !== 0) return false;
  const groups = groupByValue(cards);
  const sizes = Object.values(groups).map(g => g.length);
  
  if (!sizes.every(s => s === 2)) return false;
  
  const values = Object.keys(groups).map(v => parseInt(v)).sort((a, b) => a - b);
  
  // 不能包含2和大小王
  if (values.some(v => v >= 15)) return false;
  
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] - values[i] !== 1) return false;
  }
  return true;
}

// 判断飞机（连续n个三）
export function isPlane(cards) {
  if (cards.length < 6 || cards.length % 3 !== 0) return false;
  const groups = groupByValue(cards);
  const sizes = Object.values(groups).map(g => g.length);
  
  if (!sizes.every(s => s === 3)) return false;
  
  const values = Object.keys(groups).map(v => parseInt(v)).sort((a, b) => a - b);
  
  // 不能包含2和大小王
  if (values.some(v => v >= 15)) return false;
  
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i + 1] - values[i] !== 1) return false;
  }
  return true;
}

// 判断飞机带单牌
export function isPlaneWithSingle(cards) {
  const tripleCount = Math.floor(cards.length / 4);
  if (tripleCount < 1) return false;
  
  // 检查是否有tripleCount个三和tripleCount个单牌
  const groups = groupByValue(cards);
  const triples = Object.values(groups).filter(g => g.length === 3);
  const singles = Object.values(groups).filter(g => g.length === 1);
  
  if (triples.length !== tripleCount || singles.length !== tripleCount) return false;
  
  const tripleValues = triples.map(t => t[0].value).sort((a, b) => a - b);
  
  // 不能包含2和大小王
  if (tripleValues.some(v => v >= 15)) return false;
  
  for (let i = 0; i < tripleValues.length - 1; i++) {
    if (tripleValues[i + 1] - tripleValues[i] !== 1) return false;
  }
  return true;
}

// 判断飞机带对子
export function isPlaneWithPair(cards) {
  const tripleCount = cards.length / 5; // 每个飞机带一对
  if (!Number.isInteger(tripleCount) || tripleCount < 1) return false;
  
  const groups = groupByValue(cards);
  const triples = Object.values(groups).filter(g => g.length === 3);
  const pairs = Object.values(groups).filter(g => g.length === 2);
  
  if (triples.length !== tripleCount || pairs.length !== tripleCount) return false;
  
  const tripleValues = triples.map(t => t[0].value).sort((a, b) => a - b);
  
  // 不能包含2和大小王
  if (tripleValues.some(v => v >= 15)) return false;
  
  for (let i = 0; i < tripleValues.length - 1; i++) {
    if (tripleValues[i + 1] - tripleValues[i] !== 1) return false;
  }
  return true;
}

// 判断四带二（单）
export function isFourWithTwoSingle(cards) {
  if (cards.length !== 6) return false;
  const groups = groupByValue(cards);
  const sizes = Object.values(groups).map(g => g.length);
  return sizes.includes(4) && sizes.filter(s => s === 1).length === 2;
}

// 判断四带二（对）
export function isFourWithTwoPair(cards) {
  if (cards.length !== 8) return false;
  const groups = groupByValue(cards);
  const sizes = Object.values(groups).map(g => g.length);
  return sizes.includes(4) && sizes.filter(s => s === 2).length === 2;
}

// 判断炸弹
export function isBomb(cards) {
  if (cards.length !== 4) return false;
  return cards[0].value === cards[1].value && 
         cards[1].value === cards[2].value && 
         cards[2].value === cards[3].value;
}

// 判断火箭
export function isRocket(cards) {
  if (cards.length !== 2) return false;
  const values = cards.map(getCardValue);
  return values.includes(16) && values.includes(17);
}

// 获取牌型
export function getCardType(cards) {
  if (cards.length === 0) return null;
  
  // 按值排序
  const sorted = [...cards].sort((a, b) => a.value - b.value);
  
  if (isRocket(sorted)) return { type: CARD_TYPES.ROCKET, value: 17 };
  if (isBomb(sorted)) return { type: CARD_TYPES.BOMB, value: sorted[0].value };
  if (isFourWithTwoPair(sorted)) return { type: CARD_TYPES.FOUR_WITH_TWO_PAIR, value: sorted[0].value };
  if (isFourWithTwoSingle(sorted)) return { type: CARD_TYPES.FOUR_WITH_TWO_SINGLE, value: sorted[0].value };
  if (isPlaneWithPair(sorted)) return { type: CARD_TYPES.PLANE_WITH_PAIR, value: sorted.find(c => c.value === 3)?.value || sorted[0].value };
  if (isPlaneWithSingle(sorted)) return { type: CARD_TYPES.PLANE_WITH_SINGLE, value: sorted.find(c => c.value === 3)?.value || sorted[0].value };
  if (isPlane(sorted)) return { type: CARD_TYPES.PLANE, value: sorted.find(c => c.value === 3)?.value || sorted[0].value };
  if (isPairSequence(sorted)) return { type: CARD_TYPES.PAIR_SEQUENCE, value: sorted[0].value };
  if (isSequence(sorted)) return { type: CARD_TYPES.SEQUENCE, value: sorted[0].value };
  if (isTripleWithPair(sorted)) return { type: CARD_TYPES.TRIPLE_WITH_PAIR, value: sorted[0].value };
  if (isTripleWithSingle(sorted)) return { type: CARD_TYPES.TRIPLE_WITH_SINGLE, value: sorted[0].value };
  if (isTriple(sorted)) return { type: CARD_TYPES.TRIPLE, value: sorted[0].value };
  if (isPair(sorted)) return { type: CARD_TYPES.PAIR, value: sorted[0].value };
  if (isSingle(sorted)) return { type: CARD_TYPES.SINGLE, value: sorted[0].value };
  
  return null;
}

// 比较两个牌型的大小
export function compareCards(cards1, cards2) {
  const type1 = getCardType(cards1);
  const type2 = getCardType(cards2);
  
  if (!type1 || !type2) return false;
  
  // 火箭最大
  if (type1.type === CARD_TYPES.ROCKET) return true;
  if (type2.type === CARD_TYPES.ROCKET) return false;
  
  // 炸弹可以打任何非炸弹
  if (type1.type === CARD_TYPES.BOMB && type2.type !== CARD_TYPES.BOMB) return true;
  if (type2.type === CARD_TYPES.BOMB && type1.type !== CARD_TYPES.BOMB) return false;
  
  // 同类型比较主值
  if (type1.type === type2.type) {
    return type1.value > type2.value;
  }
  
  return false;
}

// 检查是否可以用某牌型压制
export function canBeat(cards, lastCards) {
  if (lastCards.length === 0) return true;
  return compareCards(cards, lastCards);
}
