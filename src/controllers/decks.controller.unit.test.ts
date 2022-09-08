import { Request } from 'express';
import { prismaMock } from '../../prisma/client.mock';
import { index } from './decks.controller';

describe('Decks controller unit tests', () => {
  it('should return an encoded json response', async () => {
    const request = {} as Request;
    const response: any = {
      json: jest.fn((result) => result),
    }

    const queryResult = [
      {
        "id": 15,
        "name": "Smoothly Accountant",
        "player_id": 25,
        "created": new Date('2022-08-20T00:27:34.637Z'),
        "updated": new Date('2022-08-20T00:27:34.637Z'),
        "player": {
            "id": 25,
            "first_name": "Kara",
            "last_name": "Schaden",
            "email": "Kara17@example.com",
            "created": new Date("2022-08-20T00:27:34.427Z"),
            "avatar": "avatar-21f7dc9de5da2a76540c217f2d300753.jpg"
        },
        "_count": {
            "cards_in_decks": 5
        }
      },
    ];

    prismaMock.decks.findMany.mockResolvedValue(queryResult)

    const result = await index(request, response);
    const expected = {
      "data": [
          {
              "deck": {
                  "id": 15,
                  "name": "Smoothly Accountant",
                  "updated_ago": "20 days ago"
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
    expect(prismaMock.decks.findMany).toBeCalledTimes(1)
  });
});
