import type { Query } from 'express-serve-static-core';
import parseQueryParams from './card-search.filter';

describe('Parsing query parameters', () => {
  test.each([
    {
      case: 'Power',
      params: { name: 'llanowar', power: '+3' },
      expected: { name: 'llanowar', power: '+3' }
    },
    {
      case: 'Toughness',
      params: { rarity: 'rare', toughness: '7-*' },
      expected: { rarity: 'rare', toughness: '7-*' }
    },
    {
      case: 'Manacost integer',
      params: { color: 'red', manacost: '4' },
      expected: { color: 'red', manacost: 4 }
    },
    {
      case: 'Manacost float',
      params: { manacost: '0.5' },
      expected: { manacost: 0.5 }
    },
    {
      case: 'Manacost zero',
      params: { manacost: '0' },
      expected: { manacost: 0 }
    },
  ])('Can parse params $case', ({ params, expected }) => {
    const result = parseQueryParams(params);
    expect(result).toEqual(expected);
  });
});