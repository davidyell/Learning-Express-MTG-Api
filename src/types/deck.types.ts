/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

import {
  Cards, CardsInDecks, Decks, Players,
} from '@prisma/client';

export type PostCardsInDecks = {
  card_id: CardsInDecks['card_id'];
  quantity: CardsInDecks['quantity'];
  is_sideboard: CardsInDecks['is_sideboard'];
}

export type PostDeck = {
  deck: {
    name: Decks['name'];
    player_id: Players['id']
  },
  cards_in_decks: PostCardsInDecks[]
};

export type MoreThanFourValidationError = {
  card_id: Cards['id'];
  name: Cards['name'];
  count: CardsInDecks['quantity'];
};

export enum CardColor {
  R = 'Red',
  W = 'White',
  G = 'Green',
  B = 'Black',
  U = 'Blue',
}

export type MissingManaError = {
  color: CardColor
}
