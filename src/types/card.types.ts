/* eslint-disable no-unused-vars */

export enum CardColor {
  red = 'R',
  white = 'W',
  green = 'G',
  black = 'B',
  blue = 'U',
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
