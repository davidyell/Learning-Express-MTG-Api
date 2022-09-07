import  { test } from '@jest/globals';
import { manaStringToArray } from './mana.converter';

test.each([
  { manaCost: '{3}{B/G}{R}', expected: ['B/G', 'R'] },
  { manaCost: '{1}{W}{U}{B}{R}{G}', expected: ['W', 'U', 'B', 'R', 'G'] },
  { manaCost: '{W}', expected: ['W'] },
  { manaCost: '{2}{W}{W}', expected: ['W'] },
  { manaCost: null, expected: [] },
  { manaCost: '{G}{W}', expected: ['G', 'W'] },
  { manaCost: '{3}', expected: [] }
])('Can convert $manaCost cost into $expected', ({ manaCost, expected }) => {
  const result = manaStringToArray(manaCost);
  expect(result).toStrictEqual(expected);
});