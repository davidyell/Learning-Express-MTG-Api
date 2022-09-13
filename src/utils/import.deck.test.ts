import importDeck from './import.deck';

describe('Importing a deck', () => {
  it('should import `Izzet Murktide` from file', async () => {
    const result = await importDeck('../tests/fixtures/decks/Izzet Murktide a Modern deck by Notoriouss.dec');

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

  it('should fail to import `4 Color Omnath` from file for missing card', async () => {
    expect(async () => await importDeck('../tests/fixtures/decks/4 Color Omnath a Modern deck by Antoine57437.dec')).rejects.toThrowError();
  });
});