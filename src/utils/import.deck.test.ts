import importDeck from './import.deck';

describe('Importing a deck', () => {
  it('should find all the cards', async () => {
    const result = await importDeck();

    expect(result.deck.name).toEqual('Izzet Murktide a Modern deck by Notoriouss');
    expect(result.cardsInDeck).toHaveLength(31);
    expect(result.cardsInDeck.map((card) => card.is_sideboard === false)).toHaveLength(22);
    expect(result.cardsInDeck.map((card) => card.is_sideboard === true)).toHaveLength(9);
  });
});