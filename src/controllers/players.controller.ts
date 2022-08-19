import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const index = async (request: Request, response: Response) => {
  const results = await prisma.players.findMany();

  return response.json(results);
};

const view = async (request: Request, response: Response) => {
  const result = await prisma.players.findUniqueOrThrow({
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
