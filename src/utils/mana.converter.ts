import { uniq } from 'lodash';

/**
 * Convert a letter mana casting cost into an array of colors
 *
 * eg, `{1}{W}{G}` becomes `['W', 'G']`
 */
const manaStringToArray = (manaCost: string | null): string[] => {
  const requiredColors: string[] = [];

  if (manaCost === null) {
    return [];
  }

  const regex = /(?:{([WBRGU/]+)})/g;
  const cardColors = [...manaCost.matchAll(regex)];

  if (cardColors.length === 0) {
    return [];
  }

  cardColors.forEach((matches) => {
    requiredColors.push(matches[1]);
  });

  return uniq(requiredColors);
};

export default manaStringToArray;
