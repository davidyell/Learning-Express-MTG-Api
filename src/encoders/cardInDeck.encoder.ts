import { Card, CardsInDeck } from '@prisma/client';
import cardEncoder from './card.encoder';

type CardsInDecksWithCards = CardsInDeck & { cards: Card };

const cardInDeckEncoder = (cardInDeck: CardsInDecksWithCards) => ({
  card: cardEncoder(cardInDeck.cards),
  meta: {
    quantity: cardInDeck.quantity,
    is_sideboard: cardInDeck.is_sideboard,
  },
});

export default cardInDeckEncoder;
