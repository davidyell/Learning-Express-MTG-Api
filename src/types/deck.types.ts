import {
  Card, CardsInDeck, Deck, Player,
} from '@prisma/client';
import { CardColor } from './card.types';

export type PostCardsInDecks = {
  card_id: CardsInDeck['card_id'];
  quantity: CardsInDeck['quantity'];
  is_sideboard: CardsInDeck['is_sideboard'];
}

export type PostDeck = {
  deck: {
    name: Deck['name'];
    player_id: Player['id']
  },
  cards_in_decks: PostCardsInDecks[]
};

export type MoreThanFourError = {
  card_id: Card['id'];
  name: Card['name'];
  count: CardsInDeck['quantity'];
};

export type MissingManaError = {
  color: CardColor
}

export type DeckValidationErrors = {
  hasLands: boolean;
  missingManaForColor: MissingManaError[];
  fourOrMore: MoreThanFourError[];
  sideboardSize: boolean,
  deckSize: boolean,
}
