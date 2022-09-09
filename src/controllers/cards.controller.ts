import { Request, Response } from 'express';
import cardEncoder from '../encoders/card.encoder';
import prismaClient from '../../prisma/client';

const view = async (request: Request, response: Response) => {
  try {
    const result = await prismaClient.card.findUniqueOrThrow({
      where: { id: parseInt(request.params.id, 10) },
    });

    const responseData = {
      data: cardEncoder(result),
    };

    return response.json(responseData);
  } catch (error) {
    return response.status(404).json({ error: 'Card not found' });
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  view,
};
