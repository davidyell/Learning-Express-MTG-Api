import { CardsInDecks } from '@prisma/client';

const countDeckSize = (cards: CardsInDecks[]): number => {
  const size = 0;
  const deckSize = cards.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    size,
  );

  return deckSize;
};

// eslint-disable-next-line import/prefer-default-export
export { countDeckSize };
