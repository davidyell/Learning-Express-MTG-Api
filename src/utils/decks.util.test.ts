import { countDeckSize } from './decks.util'

describe('Deck counting utility', () => {
  it('should count cards', () => {
    const cardsInDeck = [
      {
        "id": 1,
        "deck_id": 1,
        "card_id": 2068,
        "quantity": 4,
        "is_sideboard": 0,
      },
      {
        "id": 2,
        "deck_id": 1,
        "card_id": 34392,
        "quantity": 2,
        "is_sideboard": 0,
      }
    ];

    const result = countDeckSize(cardsInDeck);

    expect(result).toBe(6);
  });
});
