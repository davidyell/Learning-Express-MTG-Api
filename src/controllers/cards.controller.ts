import { Request, Response } from 'express';
import prismaClient from '../../prisma/client';

const view = async (request: Request, response: Response) => {
  try {
    const result = await prismaClient.cards.findUniqueOrThrow({
      where: { id: parseInt(request.params.id, 10) },
    });

    return response.json(result);
  } catch (error) {
    return response.status(404).json({ error: 'Card not found' });
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  view,
};
