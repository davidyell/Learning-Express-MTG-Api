import { mockDeep } from 'jest-mock-extended';

jest.mock('@prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock('express');

import { Request, Response } from 'express';
import { index, view } from './decks.controller'
import { Decks, PrismaClient } from '@prisma/client';

const mockPrisma = jest.mocked(mockDeep<PrismaClient>());
const mockRequest = jest.mocked(mockDeep<Request>());

describe('Decks controller', () => {
  beforeEach(() => {
    // mockReset(prismaMock);
  });  
  
  it('should return a json response', async () => {
    const response: any = {
      json: jest.fn(),
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

    mockPrisma.decks.findMany.mockResolvedValue(data)

    const result = await index(mockRequest, response);

    expect(result).toEqual(data)
    expect(mockPrisma.decks.findMany).toBeCalledTimes(1)
  });
});
