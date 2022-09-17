/* eslint-disable no-unused-vars */

export enum CardColor {
  R = 'Red',
  W = 'White',
  G = 'Green',
  B = 'Black',
  U = 'Blue',
}

export enum CardRarity {
  common = 'common',
  uncommon = 'uncommon',
  rare = 'rare',
  mythic = 'mythic',
  special = 'special',
  bonus = 'bonus'
}

export type CardSearchFilters = {
  name?: string;
  color?: CardColor;
  type?: string;
  manacost?: number;
  ability?: string;
  power?: string;
  toughness?: string;
  rarity?: CardRarity;
}
