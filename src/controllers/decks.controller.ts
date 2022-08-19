import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const index = async (request: Request, response: Response) => {
  const results = await prisma.decks.findMany({
    include: {
      player: true,
    },
  });

  return response.json(results);
};

const view = async (request: Request, response: Response) => {
  const result = await prisma.decks.findUniqueOrThrow({
    where: { id: parseInt(request.params.id, 10) },
    include: {
      player: true,
      cards_in_decks: {
        include: {
          cards: {
            select: {
              id: true,
              name: true,
              colorIdentity: true,
              convertedManaCost: true,
              manaCost: true,
              manaValue: true,
              rarity: true,
              subtypes: true,
              supertypes: true,
              type: true,
              power: true,
              toughness: true,
              text: true,
            },
          },
        },
      },
    },
  });

  response.json(result);
};

export {
  index,
  view,
};
