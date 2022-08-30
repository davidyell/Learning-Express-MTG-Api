import { Request, Response } from 'express';
import prismaClient from '../../prisma/client';

const index = async (request: Request, response: Response) => {
  const results = await prismaClient.decks.findMany({
    include: {
      player: true,
      _count: {
        select: {
          cards_in_decks: true,
        },
      },
    },
  });

  return response.json(results);
};

const view = async (request: Request, response: Response) => {
  const result = await prismaClient.decks.findUniqueOrThrow({
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
