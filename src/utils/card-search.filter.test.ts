import type { Query } from 'express-serve-static-core';
import parseQueryParams from './card-search.filter';

describe('Parsing query parameters', () => {
  test.each([
    {
      case: 'Power',
      params: { name: 'llanowar', power: '1' },
      expected: { name: 'llanowar', power: 1 }
    },
    {
      case: 'Toughness',
      params: { rarity: 'rare', toughness: '6' },
      expected: { rarity: 'rare', toughness: 6 }
    },
    {
      case: 'Manacost',
      params: { color: 'red', manacost: '4' },
      expected: { color: 'red', manacost: 4 }
    },
  ])('Can parse params $case', ({ params, expected }) => {
    const result = parseQueryParams(params);
    expect(result).toEqual(expected);
  });

  it('should ignore invalid params', () => {
    const params: Query = {
      manacost: 'Badger',
      power: 'Weasel',
      toughness: 'Fox'
    };

    const result = parseQueryParams(params);

    expect(result).toEqual({});
  });
});