import { Request, Response } from 'express';
import prismaClient from '../../prisma/client';

const view = async (request: Request, response: Response) => {
  const result = await prismaClient.cards.findUniqueOrThrow({
    where: { id: parseInt(request.params.id, 10) },
  });

  response.json(result);
};

export {
  // eslint-disable-next-line import/prefer-default-export
  view,
};
