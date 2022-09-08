import { Decks } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const deckEncoder = (deck: Decks) => ({
  id: deck.id,
  name: deck.name,
  updated_ago: dayjs(deck.updated).fromNow(),
});

export default deckEncoder;
