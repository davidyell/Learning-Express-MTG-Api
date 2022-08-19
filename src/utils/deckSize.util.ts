import { cards_in_decks } from "@prisma/client";

const countDeckSize = (cards: cards_in_decks[]): number => {
  const size = 0;
  const deckSize = cards.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    size,
  );

  return deckSize;
};

// eslint-disable-next-line import/prefer-default-export
export { countDeckSize };
