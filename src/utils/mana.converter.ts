import { uniq } from 'lodash';

const manaStringToArray = (manaCost: string | null): string[] => {
  const requiredColors: string[] = [];

  if (manaCost === null) {
    return [];
  }

  const regex = /(?:{[\d]})?(?:{([WBRGU/]+)})?(?:{([WBRGU/]+)})?(?:{([WBRGU/]+)})?(?:{([WBRGU/]+)})?(?:{([WBRGU/]+)})?/gi;
  const cardColors = [...manaCost.matchAll(regex)];

  if (cardColors[0] === undefined) {
    return [];
  }

  // TODO: Could you use a forEach with a shorthand check and assignment?
  // cardColors[0][index] !== undefined ? requiredColors.push(cardColors[0][1]) : null;

  if (cardColors[0][1] !== undefined) {
    requiredColors.push(cardColors[0][1]);
  }
  if (cardColors[0][2] !== undefined) {
    requiredColors.push(cardColors[0][2]);
  }
  if (cardColors[0][3] !== undefined) {
    requiredColors.push(cardColors[0][3]);
  }
  if (cardColors[0][4] !== undefined) {
    requiredColors.push(cardColors[0][4]);
  }
  if (cardColors[0][5] !== undefined) {
    requiredColors.push(cardColors[0][5]);
  }

  return uniq(requiredColors);
};

export {
  // eslint-disable-next-line import/prefer-default-export
  manaStringToArray,
};
