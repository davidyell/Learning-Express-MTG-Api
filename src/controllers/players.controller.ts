import { Request, Response } from 'express';
import prismaClient from '../../prisma/client';

const index = async (request: Request, response: Response) => {
  const results = await prismaClient.players.findMany({
    include: {
      _count: {
        select: {
          decks: true,
        },
      },
    },
  });

  return response.json(results);
};

const view = async (request: Request, response: Response) => {
  const result = await prismaClient.players.findUniqueOrThrow({
    where: { id: parseInt(request.params.id, 10) },
    include: {
      decks: true,
    },
  });

  return response.json(result);
};

export {
  index,
  view,
};
