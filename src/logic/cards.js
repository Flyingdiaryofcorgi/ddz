// 扑克牌数据定义
export const SUITS = ['♠', '♥', '♣', '♦'];
export const RANKS = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
export const JOKER = ['小王', '大王'];

// 牌的花色和大小映射
export const SUIT_COLORS = {
  '♠': 'black',
  '♥': 'red',
  '♣': 'black',
  '♦': 'red'
};

export const RANK_VALUES = {
  '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15,
  '小王': 16, '大王': 17
};

// 创建54张牌
export function createDeck() {
  const deck = [];
  
  // 普通牌
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        id: `${suit}${rank}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
        isRed: SUIT_COLORS[suit] === 'red'
      });
    });
  });
  
  // 大小王
  deck.push({ id: 'joker_small', rank: '小王', value: 16, isRed: false });
  deck.push({ id: 'joker_big', rank: '大王', value: 17, isRed: false });
  
  return deck;
}

// 洗牌
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 发牌
export function dealCards(deck) {
  const player1 = [];
  const player2 = [];
  const bottomCards = [];
  
  for (let i = 0; i < deck.length; i++) {
    if (i < 17) {
      player1.push(deck[i]);
    } else if (i < 34) {
      player2.push(deck[i]);
    } else {
      bottomCards.push(deck[i]);
    }
  }
  
  return { player1, player2, bottomCards };
}
