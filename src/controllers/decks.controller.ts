import type { Deck } from '@prisma/client';
import { Request, Response } from 'express';
import deckEncoder from '../encoders/deck.encoder';
import playerEncoder from '../encoders/player.encoder';
import cardInDeckEncoder from '../encoders/cardInDeck.encoder';
import prismaClient from '../../prisma/client';
import type { PostDeck } from '../types/deck.types';
import DeckValidator from '../validators/deck.validator';

const index = async (request: Request, response: Response) => {
  const results = await prismaClient.deck.findMany({
    include: {
      player: true,
      _count: {
        select: {
          cards_in_decks: true,
        },
      },
    },
  });

  const responseData = {
    data: results.map((result) => ({
      deck: deckEncoder(result),
      player: playerEncoder(result.player),
      meta: {
        // eslint-disable-next-line no-underscore-dangle
        card_count: result._count.cards_in_decks,
      },
    })),
  };

  return response.json(responseData);
};

const view = async (request: Request, response: Response) => {
  try {
    const result = await prismaClient.deck.findUniqueOrThrow({
      where: { id: parseInt(request.params.id, 10) },
      include: {
        player: true,
        cards_in_decks: {
          include: {
            cards: true,
          },
        },
      },
    });

    const responseData = {
      data: {
        deck: deckEncoder(result),
        player: playerEncoder(result.player),
        cards_in_deck: result.cards_in_decks.map((cardInDeck) => cardInDeckEncoder(cardInDeck)),
      },
    };

    return response.json(responseData);
  } catch (error) {
    return response.status(404).json({ error: 'No deck found' });
  }
};

const create = async (request: Request, response: Response) => {
  const postData: PostDeck = request.body;

  // Validate the deck
  const cardIds = postData.cards_in_decks.map((card) => card.card_id);
  const cardData = await prismaClient.card.findMany({ where: { id: { in: cardIds } } });
  const validator = new DeckValidator(postData.cards_in_decks, cardData);
  const isValid = validator.isValid();

  try {
    Object.values(isValid).forEach((outcome) => {
      if (typeof outcome === 'boolean' && outcome === false) {
        throw new Error('Failed validation');
      }
      if (Array.isArray(outcome) && outcome.length > 0) {
        throw new Error('Failed validation');
      }
      return true;
    });
  } catch (error) {
    return response.status(400).json({ error: isValid });
  }

  // Save the new deck
  const newDeck = await prismaClient.deck.create({
    data: {
      name: postData.deck.name,
      player_id: postData.deck.player_id,
      cards_in_decks: {
        create: postData.cards_in_decks,
      },
    },
  });

  const responseData = {
    data: {
      deck: deckEncoder(newDeck),
    },
  };

  return response.json(responseData);
};

const edit = async (request: Request, response: Response) => {
  const postData: PostDeck = request.body;
  const deckId: Deck['id'] = parseInt(request.params.id, 10);

  // Validate the deck
  const cardIds = postData.cards_in_decks.map((card) => card.card_id);
  const cardData = await prismaClient.card.findMany({ where: { id: { in: cardIds } } });
  const validator = new DeckValidator(postData.cards_in_decks, cardData);
  const isValid = validator.isValid();

  try {
    Object.entries(isValid).forEach(([, outcome]) => {
      if (typeof outcome === 'boolean' && outcome === false) {
        throw new Error('Failed validation');
      }
      if (Array.isArray(outcome) && outcome.length > 0) {
        throw new Error('Failed validation');
      }
      return true;
    });
  } catch (error) {
    return response.status(400).json({ error: isValid });
  }

  // Update the deck
  const updatedDeck = await prismaClient.deck.update({
    where: { id: deckId },
    data: {
      name: postData.deck.name,
      cards_in_decks: {
        deleteMany: { deck_id: deckId },
        create: postData.cards_in_decks,
      },
    },
  });

  const responseData = {
    data: {
      deck: deckEncoder(updatedDeck),
    },
  };

  return response.json(responseData);
};

const remove = async (request: Request, response: Response) => {
  const deckId: Deck['id'] = parseInt(request.params.id, 10);

  try {
    await prismaClient.deck.delete({
      where: { id: deckId },
    });
  } catch (error) {
    return response.status(404).json({ error: 'Deck not found' });
  }

  return response.status(204);
};

export {
  index,
  view,
  create,
  edit,
  remove,
};
