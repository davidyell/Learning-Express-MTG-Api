import { Request, Response } from 'express';
import playerEncoder from '../encoders/player.encoder';
import prismaClient from '../../prisma/client';
import deckEncoder from '../encoders/deck.encoder';

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
  try {
    const result = await prismaClient.player.findUniqueOrThrow({
      where: { id: parseInt(request.params.id, 10) },
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
    return response.status(404).json({ error: 'Player not found' });
  }
};

export {
  index,
  view,
};
