import { CardsInDecks, PrismaClient } from '@prisma/client';

const countDeckSize = (cards: CardsInDecks[]): number => {
  const size = 0;
  const deckSize = cards.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    size,
  );

  return deckSize;
};

const countDecksForPlayer = async (playerId: number): Promise<number> => {
  const prisma = new PrismaClient();

  const count = await prisma.decks.count({
    where: { player_id: playerId },
  });

  return count;
};

export { countDeckSize, countDecksForPlayer };
