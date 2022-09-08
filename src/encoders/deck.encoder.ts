import { Decks } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const DeckEncoder = (deck: Decks) => ({
  id: deck.id,
  name: deck.name,
  updatedAgo: dayjs(deck.updated).fromNow(),
});

export default DeckEncoder;
