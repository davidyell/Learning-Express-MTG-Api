import { Request, Response } from 'express';
import { prismaMock } from '../../prisma/client.mock';
import { index, view } from './decks.controller';


describe('Decks controller', () => {

  /**
   * A low value test as both components of the unit of code are mocked
   */
  it('should return a json response', async () => {
    const request = {} as Request;

    const response: any = {
      json: jest.fn((result) => result),
    }

    const data: any[] = [
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
            "created": "2022-08-20T00:27:34.427Z",
            "avatar": "avatar-21f7dc9de5da2a76540c217f2d300753.jpg"
        },
        "_count": {
            "cards_in_decks": 5
        }
      },
    ];

    prismaMock.decks.findMany.mockResolvedValue(data)

    const result = await index(request, response);

    expect(result).toEqual(data);
    expect(prismaMock.decks.findMany).toBeCalledTimes(1)
  });

});
