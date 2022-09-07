import { Decks } from '@prisma/client';
import { Request, Response } from 'express';
import prismaClient from '../../prisma/client';
import type { PostDeck } from '../types/deck.types';
import DeckValidator from '../validators/deck.validator';

const index = async (request: Request, response: Response) => {
  const results = await prismaClient.decks.findMany({
    include: {
      player: true,
      _count: {
        select: {
          cards_in_decks: true,
        },
      },
    },
  });

  return response.json(results);
};

const view = async (request: Request, response: Response) => {
  try {
    const result = await prismaClient.decks.findUniqueOrThrow({
      where: { id: parseInt(request.params.id, 10) },
      include: {
        player: true,
        cards_in_decks: {
          include: {
            cards: {
              select: {
                id: true,
                name: true,
                colorIdentity: true,
                convertedManaCost: true,
                manaCost: true,
                manaValue: true,
                rarity: true,
                subtypes: true,
                supertypes: true,
                type: true,
                power: true,
                toughness: true,
                text: true,
              },
            },
          },
        },
      },
    });

    return response.json(result);
  } catch (error) {
    return response.status(404).json({ error: 'No deck found' });
  }
};

const create = async (request: Request, response: Response) => {
  const postData: PostDeck = request.body;

  // Validate the deck
  const cardIds = postData.cards_in_decks.map((card) => card.card_id);
  const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
  const validator = new DeckValidator(postData.cards_in_decks, cardData);
  const isValid = validator.isValid();

  try {
  // eslint-disable-next-line no-unused-vars
    Object.entries(isValid).forEach(([rule, outcome]) => {
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
  const newDeck = await prismaClient.decks.create({
    data: {
      name: postData.deck.name,
      player_id: postData.deck.player_id,
      cards_in_decks: {
        create: postData.cards_in_decks,
      },
    },
  });

  return response.json(newDeck);
};

const edit = async (request: Request, response: Response) => {
  const postData: PostDeck = request.body;
  const deckId: Decks['id'] = parseInt(request.params.id, 10);

  // Validate the deck
  const cardIds = postData.cards_in_decks.map((card) => card.card_id);
  const cardData = await prismaClient.cards.findMany({ where: { id: { in: cardIds } } });
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
  const deck = await prismaClient.decks.update({
    where: { id: deckId },
    data: {
      name: postData.deck.name,
      cards_in_decks: {
        deleteMany: { deck_id: deckId },
        create: postData.cards_in_decks,
      },
    },
  });

  return response.json(deck);
};

const remove = async (request: Request, response: Response) => response.json({ data: 'A message to confirm deletion' });

export {
  index,
  view,
  create,
  edit,
  remove,
};
