import { Request, Response } from 'express';
import cardEncoder from '../encoders/card.encoder';
import prismaClient from '../../prisma/client';
import { filterToWhereClause, parseQueryParams } from '../utils/card-search.filter';

const search = async (request: Request, response: Response) => {
  const filter = parseQueryParams(request.query);
  const whereOptions = filterToWhereClause(filter);

  const results = await prismaClient.card.findMany({
    where: whereOptions,
  });

  const responseData = {
    data: {
      cards: results.map((card) => cardEncoder(card)),
      meta: {
        count: results.length,
      },
    },
  };

  return response.json(responseData);
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
