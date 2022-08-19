import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const view = async (request: Request, response: Response) => {
  const result = await prisma.cards.findUniqueOrThrow({
    where: { id: parseInt(request.params.id, 10) },
  });

  response.json(result);
};

export {
  // eslint-disable-next-line import/prefer-default-export
  view,
};
