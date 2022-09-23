import type { Deck } from '@prisma/client';
import { Request, Response } from 'express';
import deckEncoder from '../encoders/deck.encoder';
import playerEncoder from '../encoders/player.encoder';
import cardInDeckEncoder from '../encoders/cardInDeck.encoder';
import prismaClient from '../../prisma/client';
import type { DeckListRaw, PostDeck } from '../types/deck.types';
import DeckValidator from '../validators/deck.validator';
import { GenericError, ValidationError } from '../types/error.types';

const index = async (request: Request, response: Response) => {
  // Prisma doesn't support using SUM() on an association, so have to do a manual query
  const results = await prismaClient.$queryRaw<DeckListRaw[]>`SELECT decks.id AS deck_id,decks.name AS deck_name,decks.player_id AS deck_player_id,decks.created AS deck_created,decks.updated AS deck_updated,players.id AS player_id,players.email AS player_email,players.first_name AS player_first_name,players.last_name AS player_last_name,players.avatar as player_avatar,SUM(cards_in_decks.quantity)AS total_cards FROM decks JOIN players ON decks.player_id=players.id JOIN cards_in_decks ON cards_in_decks.deck_id=decks.id GROUP BY decks.id`;

  const responseData = {
    data: results.map((result: DeckListRaw) => ({
      deck: deckEncoder({
        id: result.deck_id,
        name: result.deck_name,
        updated: result.deck_updated,
      }),
      player: playerEncoder({
        id: result.player_id,
        first_name: result.player_first_name,
        last_name: result.player_last_name,
        avatar: result.player_avatar,
      }),
      meta: {
        // Sidestep the issue serializing BigInt
        card_count: parseInt(result.total_cards.toString(), 10),
      },
    })),
  };

  return response.json(responseData);
};

const view = async (request: Request, response: Response) => {
  const deckId: Deck['id'] = parseInt(request.params.id, 10);

  try {
    const result = await prismaClient.deck.findUniqueOrThrow({
      where: { id: deckId },
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
    return response.status(404).json({
      data: {},
      error: {
        message: `Could not find a deck with id ${deckId}`,
        code: '404',
      },
    } as GenericError);
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
    return response.status(400).json({
      data: {},
      error: {
        message: 'Your deck could not be validated',
        code: '400',
        ...isValid,
      },
    } as ValidationError);
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
    return response.status(400).json({
      data: {},
      error: {
        message: 'Your deck could not be validated',
        code: '400',
        ...isValid,
      },
    } as ValidationError);
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
    return response.status(404).json({
      data: {},
      error: {
        message: `Could not find a deck with id ${deckId}`,
        code: '404',
      },
    } as GenericError);
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
