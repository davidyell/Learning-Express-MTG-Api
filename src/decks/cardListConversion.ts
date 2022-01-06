function listToArray(cards: string): string[] {
  return cards.split(', ');
}

function arrayToList(cards: string[]): string {
  return cards.join(', ');
}

module.exports = {
  listToArray,
  arrayToList,
};
