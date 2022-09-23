import { NotFoundError } from '@prisma/client/runtime';
import express, { Request } from 'express';
import prismaClient from '../../prisma/client';
import { prismaMock } from '../../prisma/client.mock';
import exampleDeck from '../tests/fixtures/example.deck.payload';
import { DeckListRaw } from '../types/deck.types';
import { index, view } from './decks.controller';

describe('Decks controller integration tests', () => {
  it('should create a new deck', async () => {
    const player = await prismaClient.player.findFirst();
    if (player === null) throw Error('No players found');

    const postData = {...exampleDeck};

    const newDeck = await prismaClient.deck.create({
      data: {
        name: postData.deck.name,
        player_id: player.id,
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

  it('should return an encoded json response', async () => {
    const request = {} as Request;
    const response: any = {
      json: jest.fn((result) => result),
    }

    const queryResult: DeckListRaw[] = [
      {
        deck_id: 11,
        deck_name: 'Burn a Modern deck by Michael Barnes',
        deck_player_id: 5,
        deck_created: new Date("2022-09-21T14:17:12.324Z"),
        deck_updated: new Date("2022-09-21T14:17:12.325Z"),
        player_id: 5,
        player_email: 'Glen_Johnston29@example.net',
        player_first_name: 'Glen',
        player_last_name: 'Johnston',
        player_avatar: "avatar-21f7dc9de5da2a76540c217f2d300753.jpg",
        total_cards: 73
      },
    ];

    prismaMock.$queryRaw.mockResolvedValue(queryResult)

    const result = await index(request, response);
    const expected = {
      "data": [
        {
          "deck": {
            "id": 11,
            "name": "Burn a Modern deck by Michael Barnes",
            "updated": "2022-09-21T14:17:12.325Z"
          },
          "player": {
            "id": 5,
            "first_name": "Glen",
            "last_name": "Johnston",
            "avatar": "avatar-21f7dc9de5da2a76540c217f2d300753.jpg"
          },
          "meta": {
            "card_count": 73
          }
        }
      ]
    };

    expect(result).toEqual(expected);
    expect(prismaMock.$queryRaw).toBeCalledTimes(1)
  });

  it('should return an error when deck is not found', async () => {
    const request = jest.mocked(express.request) as Request;
    request.params = { id: '9999' };

    const response = jest.mocked(express.response);
    response.json = jest.fn((json) => json);

    prismaMock.deck.findUniqueOrThrow.mockImplementation(
      () => { throw NotFoundError }
    );

    const result = await view(request, response);
    const expected = {
      data: {},
      error: {
        message: 'Could not find a deck with id 9999',
        code: '404'
      }
    };

    expect(result).toEqual(expected);
    expect(prismaMock.deck.findUniqueOrThrow).toBeCalledTimes(1)
  });

  it.skip('should return deck validation errors', () => {
    // TODO: Write this test
  });
});
