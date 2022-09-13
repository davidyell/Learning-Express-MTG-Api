import importDeck from './import.deck';

describe('Importing a deck', () => {
  it('should import `Izzet Murktide` from file', async () => {
    const result = await importDeck('../src/tests/fixtures/decks/Izzet Murktide a Modern deck by Notoriouss.dec');

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

  it('should import `4 Color Omnath` from file with missing cards', async () => {
    const result = await importDeck('../src/tests/fixtures/decks/4 Color Omnath a Modern deck by Antoine57437.dec');

    expect(result.deck.name).toEqual('4 Color Omnath a Modern deck by Antoine57437');
    expect(result.cardsInDeck).toHaveLength(40);
    expect(result.cardsNotFound).toHaveLength(2);
    expect(result.cardsInDeck.filter((card) => card.is_sideboard === false)).toHaveLength(30);
    expect(result.cardsInDeck.filter((card) => card.is_sideboard === true)).toHaveLength(10);
  });

  it('should import `Burn` from file with missing cards', async () => {
    const result = await importDeck('../src/tests/fixtures/decks/Burn a Modern deck by Michael Barnes.dec');

    expect(result.deck.name).toEqual('Burn a Modern deck by Michael Barnes');
    expect(result.cardsInDeck).toHaveLength(23);
    expect(result.cardsNotFound).toHaveLength(1);
    expect(result.cardsInDeck.filter((card) => card.is_sideboard === false)).toHaveLength(17);
    expect(result.cardsInDeck.filter((card) => card.is_sideboard === true)).toHaveLength(6);
  });
});