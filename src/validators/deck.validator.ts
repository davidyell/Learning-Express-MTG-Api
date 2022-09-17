import { Card, CardsInDeck } from '@prisma/client';
import {
  isEqual, isNil, uniq, uniqWith,
} from 'lodash';
import manaStringToArray from '../utils/mana.converter';
import type { DeckValidationErrors, MissingManaError, MoreThanFourError } from '../types/deck.types';
import { CardColor } from '../types/card.types';

// Define a new type for a deck which allows for both saved and unsaved decks
type PartialCardsInDecks = Omit<CardsInDeck, 'id' | 'deck_id'> | CardsInDeck;

/**
 * Validate a built deck based on the rules for Constructed
 *
 * @see https://magic.wizards.com/en/rules
 */
export default class DeckValidator {
  private cards_in_decks: Readonly<PartialCardsInDecks>[];

  private cards: Readonly<Card>[];

  constructor(cardsInDecks: PartialCardsInDecks[], cardData: Card[]) {
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
   * Decks should really contain some lands to generate mana
   */
  hasLands(color?: CardColor): boolean {
    const foundLand = this.cards.find((card: Card) => {
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
   * // TODO: Account for other sources of mana generation like artifacts
   */
  missingManaForColor(): MissingManaError[] {
    let allRequiredColors: string[] = [];
    const errors: MissingManaError[] = [];

    this.cards.forEach((card) => {
      allRequiredColors = allRequiredColors.concat(manaStringToArray(card.manaCost));
    });

    allRequiredColors = uniq(allRequiredColors);

    allRequiredColors.forEach((colorLetter) => {
      if (!colorLetter.includes('/')) {
        if (this.hasLands(colorLetter as CardColor) === false) {
          errors.push({
            color: CardColor[colorLetter as unknown as keyof typeof CardColor],
          });
        }
      } else {
        colorLetter.split('/').forEach((orColor) => {
          if (this.hasLands(orColor as CardColor) === false) {
            errors.push({
              color: CardColor[orColor as unknown as keyof typeof CardColor],
            });
          }
        });
      }
    });

    return uniqWith(errors, isEqual);
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
      const cardData = this.cards.find((card: Card) => card.id === cardInDeck.card_id);

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
