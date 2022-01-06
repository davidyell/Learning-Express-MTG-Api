const listToArray = (cards: string): string[] => cards.split(', ');

const arrayToList = (cards: string[]): string => cards.join(', ');

export {
  listToArray,
  arrayToList,
};
