import { CardColor, CardRarity } from '../types/card.types';
import { filterToWhereClause, parseQueryParams } from './card-search.filter';

describe('Card filtering utility', () => {
  test.each([
    {
      params: { name: 'llanowar', power: '+3' },
      expected: { name: 'llanowar', power: '+3' }
    },
    {
      params: { rarity: 'rare', toughness: '7-*' },
      expected: { rarity: 'rare', toughness: '7-*' }
    },
    {
      params: { color: 'red', manacost: '4' },
      expected: { color: 'R', manacost: 4 }
    },
    {
      params: { manacost: '0.5' },
      expected: { manacost: 0.5 }
    },
    {
      params: { manacost: '0' },
      expected: { manacost: 0 }
    },
  ])('can parse params - $params', ({ params, expected }) => {
    const result = parseQueryParams(params);
    expect(result).toEqual(expected);
  });

  test.each([
    {
      filter: { name: 'llanowar', color: CardColor.green, type: 'creature' },
      expected: {
        colors: { contains: 'G' },
        name: { contains: 'llanowar' },
        types: { contains: 'creature' }
      }
    },
    {
      filter: { manacost: 5, rarity: CardRarity.rare },
      expected: {
        convertedManaCost: { equals: 5 },
        rarity: { equals: 'rare' }
      }
    },
    {
      filter: {
        name: 'goblin',
        color: CardColor.red,
        type: 'creature',
        manacost: 1,
        ability: 'haste',
        power: '1',
        toughness: '2',
        rarity: CardRarity.uncommon
      },
      expected: {
        name: { contains: 'goblin' },
        colors: { contains: 'R' },
        types: { contains: 'creature' },
        convertedManaCost: { equals: 1 },
        keywords: { contains: 'haste' },
        power: { equals: '1' },
        toughness: { equals: '2' },
        rarity: { equals: 'uncommon' }
      }
    },
  ])('can create a where clause object - $filter', ({ filter, expected }) => {
    const result = filterToWhereClause(filter);
    expect(result).toEqual(expected);
  });
});