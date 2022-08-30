import prismaClient from '../../prisma/client';

describe('Decks integration tests', () => {
  beforeAll(() => {
    // TODO: Create a test database
  });

  it('should create a new deck', async () => {
    const player = await prismaClient.players.findFirst();
    if (player === null) throw Error('No players found');

    const postData = {
      deck: {
        name: 'Integration test - Can create deck',
        player_id: player.id,
      },
      cards_in_decks: [
        { // Shinka, the Bloodsoaked Keep
          card_id: 13422,
          quantity: 1,
          is_sideboard: false
        },
        { // Eiganjo Castle
          card_id: 13415,
          quantity: 1,
          is_sideboard: false
        },
        { // City of Brass
          card_id: 4503,
          quantity: 3,
          is_sideboard: false
        },
        { // Mountain
          card_id: 34736,
          quantity: 3,
          is_sideboard: false
        },
        { // Plains
          card_id: 34733,
          quantity: 12,
          is_sideboard: false
        },
        { // Samurai of the Pale Curtain
          card_id: 13174,
          quantity: 4,
          is_sideboard: false
        },
        { // Nagao, Bound by Honor
          card_id: 13167,
          quantity: 1,
          is_sideboard: false
        },
        { // Kami of Ancient Law
          card_id: 13151,
          quantity: 3,
          is_sideboard: false
        },
        { // Hearth Kami
          card_id: 13308,
          quantity: 3,
          is_sideboard: false
        },
        { // Eight-and-a-Half-Tails
          card_id: 13138,
          quantity: 1,
          is_sideboard: false
        },
        { // Savannah Lions
          card_id: 4581,
          quantity: 4,
          is_sideboard: false
        },
        { // Leonin Skyhunter
          card_id: 4565,
          quantity: 4,
          is_sideboard: false
        },
        { // Masako the Humorless
          card_id: 13164,
          quantity: 1,
          is_sideboard: false
        },
        { // Isamaru, Hound of Konda
          card_id: 13149,
          quantity: 2,
          is_sideboard: false
        },
        { // Lantern Kami
          card_id: 13163,
          quantity: 4,
          is_sideboard: false
        },
        { // Electrostatic Bolt
          card_id: 40870,
          quantity: 4,
          is_sideboard: false
        },
        { // Otherworldly Journey
          card_id: 13168,
          quantity: 3,
          is_sideboard: false
        },
        { // Raise the Alarm
          card_id: 40797,
          quantity: 2,
          is_sideboard: false
        },
        { // Glorious Anthem
          card_id: 34765,
          quantity: 4,
          is_sideboard: false
        },
        // Sideboard
        { // Mountain
          card_id: 34736,
          quantity: 1,
          is_sideboard: true
        },
        { // Auriok Champion
          card_id: 2844,
          quantity: 2,
          is_sideboard: true
        },
        { // Sacred Ground
          card_id: 4577,
          quantity: 2,
          is_sideboard: true
        },
        { // Shatter
          card_id: 40886,
          quantity: 3,
          is_sideboard: true
        },
        { // Karma
          card_id: 4206,
          quantity: 3,
          is_sideboard: true
        },
        { // Guerrilla Tactics
          card_id: 286,
          quantity: 4,
          is_sideboard: true
        }
      ]
    }

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
