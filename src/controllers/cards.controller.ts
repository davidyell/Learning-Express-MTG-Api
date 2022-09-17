import { Request, Response } from 'express';
import { Card } from '@prisma/client';
import cardEncoder from '../encoders/card.encoder';
import prismaClient from '../../prisma/client';
import { filterToWhereClause, parseQueryParams } from '../utils/card-search.filter';
import { GenericError } from '../types/error.types';

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
  const cardId: Card['id'] = parseInt(request.params.id, 10);

  try {
    const result = await prismaClient.card.findUniqueOrThrow({
      where: { id: cardId },
    });

    const responseData = {
      data: cardEncoder(result),
    };

    return response.json(responseData);
  } catch (error) {
    return response.status(404).json({
      data: {},
      error: {
        message: `Could not find card id ${cardId}`,
        code: '404',
      },
    } as GenericError);
  }
};

export {
  search,
  view,
};
