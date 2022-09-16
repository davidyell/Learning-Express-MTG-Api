import { Request, Response } from 'express';
import cardEncoder from '../encoders/card.encoder';
import prismaClient from '../../prisma/client';
import parseQueryParams from '../utils/card-search.filter';

const search = async (request: Request, response: Response) => {
  const filter = parseQueryParams(request.query);

  const whereOptions = {};

  // TODO: See which ones are set and apply the query required

  // Query the database
  const results = await prismaClient.card.findMany({
    where: whereOptions,
  });

  return response.json({
    data: {},
  });
};

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
  search,
  view,
};
