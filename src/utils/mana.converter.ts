import { uniq } from 'lodash';

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
