import { Cards, CardsInDecks } from '@prisma/client';
import cardEncoder from './card.encoder';

type CardsInDecksWithCards = CardsInDecks & { cards: Cards };

const cardInDeckEncoder = (cardInDeck: CardsInDecksWithCards) => ({
  card: cardEncoder(cardInDeck.cards),
  meta: {
    quantity: cardInDeck.quantity,
    is_sideboard: cardInDeck.is_sideboard,
  },
});

export default cardInDeckEncoder;
