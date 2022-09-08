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
  try {
    const result = await prismaClient.players.findUniqueOrThrow({
      where: { id: parseInt(request.params.id, 10) },
      include: {
        decks: true,
      },
    });

    return response.json(result);
  } catch (error) {
    return response.status(404).json({ error: 'Player not found' });
  }
};

export {
  index,
  view,
};
