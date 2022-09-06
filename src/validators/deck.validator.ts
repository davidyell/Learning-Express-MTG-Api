import { Cards, CardsInDecks } from '@prisma/client';
import { countBy, isNil } from 'lodash';
import type { DeckValidationErrors, MissingManaError, MoreThanFourError } from '../types/deck.types';
import { CardColor } from '../types/deck.types';

// Define a new type for a deck which allows for both saved and unsaved decks
type PartialCardsInDecks = Omit<CardsInDecks, 'id' | 'deck_id'> | CardsInDecks;

/**
 * Validate a built deck based on the rules for Constructed
 *
 * @see https://magic.wizards.com/en/rules
 */
export default class DeckValidator {
  private cards_in_decks: Readonly<PartialCardsInDecks>[];

  private cards: Readonly<Cards>[];

  constructor(cardsInDecks: PartialCardsInDecks[], cardData: Cards[]) {
    this.cards_in_decks = cardsInDecks;
    this.cards = cardData;
  }

  isValid(): DeckValidationErrors {
    return {
      hasLands: this.hasLands(),
      missingManaForColor: this.missingManaForColor(),
      fourOrMore: this.fourOrMore(),
      sideboardSize: this.sideboardSize(),
      deckSize: this.deckSize(),
    };
  }

  /**
   * Deck should contain some cards capable of generating mana
   */
  hasLands(color?: CardColor): boolean {
    const foundLand = this.cards.find((card: Cards) => {
      if (!isNil(color) && !isNil(card.types) && !isNil(card.colorIdentity)) {
        return card.types.includes('Land') && card.colorIdentity.includes(color);
      }

      return isNil(color) && !isNil(card.types) && card.types.includes('Land');
    });

    return !!foundLand;
  }

  /**
   * Deck should contain cards which can generate mana for the colors in the deck
   *
   * // TODO: Look for multi-color sources
   * // TODO: Account for other sources of mana generation like artifacts
   */
  missingManaForColor(): MissingManaError[] {
    const colorCount = countBy(this.cards, (value) => value.colorIdentity);

    const errors: MissingManaError[] = [];

    Object.entries(colorCount).forEach(([color]) => {
      if (!isNil(color) && color !== 'null') {
        if (this.hasLands(color as CardColor) === false) {
          const error: MissingManaError = {
            color: CardColor[color as unknown as keyof typeof CardColor],
          };

          errors.push(error);
        }
      }
    });

    return errors;
  }

  /**
   * Rule 100.2a
   * No more than 4 of any non-basic card including sideboard
   */
  fourOrMore(): MoreThanFourError[] {
    const errors: MoreThanFourError[] = [];

    // eslint-disable-next-line max-len
    const moreThanFour = this.cards_in_decks.filter((cardsInDeck: PartialCardsInDecks) => cardsInDeck.quantity > 4);

    moreThanFour.forEach((cardInDeck) => {
      const cardData = this.cards.find((card: Cards) => card.id === cardInDeck.card_id);

      if (cardData !== undefined) {
        if (!isNil(cardData.supertypes) && cardData.supertypes.includes('Basic')) {
          // noop - Basic supertype cards can be more than 4 in quantity
        } else {
          const failedCard: MoreThanFourError = {
            card_id: cardData.id,
            name: cardData.name,
            count: cardInDeck.quantity,
          };

          errors.push(failedCard);
        }
      }
    });

    return errors;
  }

  /**
   * Rule 100.4a
   * Sideboard should be 15 or fewer
   */
  sideboardSize(): boolean {
    const initial = 0;
    const total = this.cards_in_decks.reduce((previous, current) => {
      if (current.is_sideboard) {
        return previous + current.quantity;
      }

      return previous;
    }, initial);

    return total <= 15;
  }

  /**
   * Rule 100.2a
   * At least 60 cards required
   */
  deckSize(): boolean {
    const initial = 0;
    const total = this.cards_in_decks.reduce((previous, current) => {
      if (current.is_sideboard === false) {
        return previous + current.quantity;
      }

      return previous;
    }, initial);

    return total >= 60;
  }
}
