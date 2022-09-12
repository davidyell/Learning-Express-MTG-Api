import importDeck from './import.deck';

describe('Importing a deck', () => {
  it('should import from `.dec` file', async () => {
    const result = await importDeck();

    expect(result.deck.name).toEqual('Izzet Murktide a Modern deck by Notoriouss');
    expect(result.cardsInDeck).toHaveLength(31);
    expect(result.cardsInDeck[0]).toEqual({
      card_name: 'Dragon\'s Rage Channeler',
      card_id: 38055,
      quantity: 3,
      is_sideboard: false
    })
    expect(result.cardsInDeck.filter((card) => card.is_sideboard === false)).toHaveLength(22);
    expect(result.cardsInDeck.filter((card) => card.is_sideboard === true)).toHaveLength(9);
  });
});