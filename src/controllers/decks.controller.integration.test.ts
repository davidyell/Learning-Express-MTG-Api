import { NotFoundError } from '@prisma/client/runtime';
import dayjs from 'dayjs';
import express, { Request } from 'express';
import prismaClient from '../../prisma/client';
import { prismaMock } from '../../prisma/client.mock';
import exampleDeck from '../tests/fixtures/example.deck.payload';
import { index, view } from './decks.controller';

describe('Decks controller integration tests', () => {

  /**
   * TODO: Needs more time investment to create a testing database setup, which is entirely manual, for now this test will create a deck in the 'main' database
   * 
   * @see https://github.com/prisma/prisma/discussions/2792
   */
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

    const occurred = new Date(dayjs().subtract(2, 'hour').toISOString());

    const queryResult = [
      {
        "id": 15,
        "name": "Smoothly Accountant",
        "player_id": 25,
        "created": occurred,
        "updated": occurred,
        "player": {
          "id": 25,
          "first_name": "Kara",
          "last_name": "Schaden",
          "email": "Kara17@example.com",
          "created": occurred,
          "avatar": "avatar-21f7dc9de5da2a76540c217f2d300753.jpg"
        },
        "_count": {
          "cards_in_decks": 5
        }
      },
    ];

    prismaMock.deck.findMany.mockResolvedValue(queryResult)

    const result = await index(request, response);
    const expected = {
      "data": [
        {
          "deck": {
            "id": 15,
            "name": "Smoothly Accountant",
            "updated_ago": "2 hours ago"
          },
          "player": {
            "id": 25,
            "first_name": "Kara",
            "last_name": "Schaden",
            "avatar": "avatar-21f7dc9de5da2a76540c217f2d300753.jpg"
          },
          "meta": {
            "card_count": 5
          }
        }
      ]
    };

    expect(result).toEqual(expected);
    expect(prismaMock.deck.findMany).toBeCalledTimes(1)
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
