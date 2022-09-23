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

export type DeckListRaw = {
  deck_id: Deck['id'];
  deck_name: Deck['name'];
  deck_player_id: Deck['player_id'];
  deck_created: Deck['created'];
  deck_updated: Deck['updated'];
  player_id: Player['id'];
  player_email: Player['email'];
  player_first_name: Player['first_name'];
  player_last_name: Player['last_name'];
  player_avatar: Player['avatar'];
  total_cards: number;
}
