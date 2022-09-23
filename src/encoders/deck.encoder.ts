import type { Deck } from '@prisma/client';
import dayjs from 'dayjs';

const deckEncoder = (deck: Pick<Deck, 'id' | 'name' | 'updated'>) => ({
  id: deck.id,
  name: deck.name,
  updated: dayjs(deck.updated).toISOString(),
});

export default deckEncoder;
