import DeckValidator from './deck.validator';
import CreateDeck from '../tests/fixtures/create.deck';
import prismaClient from '../../prisma/client';

describe('Validating a decks cards', () => {
  beforeAll(() => {
    // TODO: Implement a testing database
  });

  it('should be valid when lands are in the deck', async () => {
    const cardIds = CreateDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(CreateDeck.cards_in_decks, cardData);

    expect(validator.hasLands()).toBeTruthy;
  });

  it('should be invalid when no lands are in the deck', async () => {
    const landsToRemove = [
      34733, // Plains
      34736 // Mountain
    ];
    
    const cardsInDeckWithNoLands = CreateDeck.cards_in_decks.filter(
      (cardsInDeck) => cardsInDeck.card_id !== landsToRemove[0] && cardsInDeck.card_id !== landsToRemove[1]
    );
    const newDeck = {...CreateDeck};
    newDeck.cards_in_decks = cardsInDeckWithNoLands;

    const cardIds = newDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(newDeck.cards_in_decks, cardData);

    expect(validator.hasLands()).toBeFalsy;
  });

  it('should ensure mana generation matches deck cards', async () => {
    const cardIds = CreateDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(CreateDeck.cards_in_decks, cardData);

    expect(validator.missingManaForColor()).toHaveLength(0);
  });

  it('should be invalid when no lands are in the deck for colors used in the deck', async () => {
    const landsToRemove = [
      34736, // Mountain
      13422, // Shinka, the Bloodsoaked Keep
    ];
    
    const newDeck = {...CreateDeck};
    newDeck.cards_in_decks = newDeck.cards_in_decks.filter(
      (cardsInDeck) => cardsInDeck.card_id !== landsToRemove[0] && cardsInDeck.card_id !== landsToRemove[1]
    );
    
    const cardIds = newDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(newDeck.cards_in_decks, cardData);

    const result = validator.missingManaForColor();
    
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].color).toEqual('Red');
  });

  it('should invalidate decks with more than 4 of a basic card', async () => {
    const newDeck = {...CreateDeck};
    newDeck.cards_in_decks[5].quantity = 9;

    const cardIds = newDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(newDeck.cards_in_decks, cardData);

    const result = validator.fourOrMore();
    
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      card_id: 13174,
      name: 'Samurai of the Pale Curtain',
      count: 9
    });
  });

  it('should invalidate a deck with a sideboard more than 15 cards', async () => {
    const newDeck = {...CreateDeck};
    newDeck.cards_in_decks.push({
      card_id: 260,
      quantity: 4,
      is_sideboard: true
    });

    const cardIds = newDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(newDeck.cards_in_decks, cardData);

    expect(validator.sideboardSize()).toBeFalsy;
  });

  it('should invalidate a deck with fewer than 60 cards', async () => {
    const newDeck = {...CreateDeck};
    newDeck.cards_in_decks = newDeck.cards_in_decks.slice(0, 8);

    const cardIds = newDeck.cards_in_decks.map((card) => card.card_id);
    const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
    const validator = new DeckValidator(newDeck.cards_in_decks, cardData);

    expect(validator.sideboardSize()).toBeFalsy;
  });
})