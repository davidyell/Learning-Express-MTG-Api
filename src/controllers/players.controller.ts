import { Request, Response } from 'express';
import { Player } from '@prisma/client';
import playerEncoder from '../encoders/player.encoder';
import prismaClient from '../../prisma/client';
import deckEncoder from '../encoders/deck.encoder';
import { GenericError } from '../types/error.types';

const index = async (request: Request, response: Response) => {
  const results = await prismaClient.player.findMany({
    include: {
      _count: {
        select: {
          decks: true,
        },
      },
    },
  });

  const responseData = {
    data: results.map((player) => ({
      player: playerEncoder(player),
      meta: {
        // eslint-disable-next-line no-underscore-dangle
        deck_count: player._count.decks,
      },
    })),
  };

  return response.json(responseData);
};

const view = async (request: Request, response: Response) => {
  const playerId: Player['id'] = parseInt(request.params.id, 10);

  try {
    const result = await prismaClient.player.findUniqueOrThrow({
      where: { id: playerId },
      include: {
        decks: true,
      },
    });

    const responseData = {
      data: {
        player: playerEncoder(result),
        decks: result.decks.map((deck) => deckEncoder(deck)),
      },
    };

    return response.json(responseData);
  } catch (error) {
    return response.status(404).json({
      data: {},
      error: {
        message: `Player with id ${playerId} could not be found`,
        code: '404',
      },
    } as GenericError);
  }
};

export {
  index,
  view,
};
