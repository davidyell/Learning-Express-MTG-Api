export enum CardColor {
  R = 'Red',
  W = 'White',
  G = 'Green',
  B = 'Black',
  U = 'Blue',
};

export enum CardRarity {
  'common',
  'uncommon',
  'rare',
  'mythic',
  'special',
  'bonus'
}

export type CardSearchFilters = {
  name?: string;
  color?: CardColor;
  type?: string;
  manacost?: number;
  ability?: string;
  power?: number;
  toughness?: number;
  rarity?: CardRarity;
}
