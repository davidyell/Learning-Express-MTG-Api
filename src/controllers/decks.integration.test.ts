import prismaClient from '../../prisma/client';
import ExampleDeck from '../tests/fixtures/create.deck';

describe('Decks integration tests', () => {

  /**
   * TODO: Needs more time investment to create a testing database setup, which is entirely manual, for now this test will create a deck in the 'main' database
   * 
   * @see https://github.com/prisma/prisma/discussions/2792
   */
  it('should create a new deck', async () => {
    const player = await prismaClient.players.findFirst();
    if (player === null) throw Error('No players found');

    const postData = ExampleDeck;

    const newDeck = await prismaClient.decks.create({
      data: {
        name: postData.deck.name,
        player_id: postData.deck.player_id,
        cards_in_decks: {
          create: postData.cards_in_decks
        }
      }
    });

    expect(newDeck).toHaveProperty('id');
    expect(newDeck).toHaveProperty('name');
    expect(newDeck.name).toEqual(postData.deck.name);
    expect(newDeck).toHaveProperty('player_id');
  });
});
