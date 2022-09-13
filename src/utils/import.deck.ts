/* eslint-disable no-continue */
import { Deck } from '@prisma/client';
import fs = require('fs')
import path = require('path')
import readline = require('readline');
import prismaClient from '../../prisma/client';
import { PostCardsInDecks } from '../types/deck.types';

type ImportedDeck = {
  deck: {
    name: Deck['name']
  },
  cardsInDeck: PostCardsInDecks[],
  cardsNotFound: string[],
}

/**
 * Find a card by either it's `name` or `faceName` in the case of double sided cards
 *
 * @throws Error if the card is not in the database
 */
const findCard = async (
  cardName: string,
  quantity: number,
  sideboard: boolean,
): Promise<PostCardsInDecks> => {
  try {
    const card = await prismaClient.card.findFirstOrThrow({
      select: { id: true, name: true },
      where: {
        OR: [
          { name: cardName },
          { faceName: cardName },
        ],
        // TODO: Availability etc could be a config option object
        availability: { contains: 'paper' },
      },
    });

    return {
      card_id: card.id,
      quantity,
      is_sideboard: sideboard,
    };
  } catch (error) {
    throw new Error(`Tried find a card named "${cardName}" but didn't find it`);
  }
};

/**
 * Import a `.dec` file and convert it into an `ImportedDeck` object, so
 * it can be inserted into the data storage
 *
 * @param filePath The path of the file
 */
const importDeck = async (filePath: string): Promise<ImportedDeck> => {
  const deckFile = path.resolve(__dirname, '../', filePath);
  const fileStream = fs.createReadStream(deckFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const deckData: ImportedDeck = {
    deck: {
      name: '',
    },
    cardsInDeck: [],
    cardsNotFound: [],
  };

  // eslint-disable-next-line no-restricted-syntax
  for await (const line of rl) {
    if (line === '') {
      continue;
    }

    // Try and grab the title from the first line of the file
    if (line.startsWith('//') && !line.startsWith('// ')) {
      const matches = line.match(/\/\/(.*)/i);
      if (matches !== null) {
        // eslint-disable-next-line prefer-destructuring
        deckData.deck.name = matches[1];
      }
      continue;
    }

    const regexes = {
      deck: /^([\d]){1,2}\s(.*)$/ig,
      sideboard: /^SB:\s([\d]){1,2}\s(.*)$/ig,
    };

    // Detect the type of line
    let isSideboard = false;
    let matchesIterator = line.matchAll(regexes.deck);
    let matchesArray = [...matchesIterator];

    if (matchesArray.length === 0) {
      matchesIterator = line.matchAll(regexes.sideboard);
      matchesArray = [...matchesIterator];
      if (matchesArray.length > 0) {
        isSideboard = true;
      }
    }

    // Build and push the object
    if (matchesArray.length > 0) {
      try {
        const cardInDeck = await findCard(
          matchesArray[0][2],
          parseInt(matchesArray[0][1], 10),
          isSideboard,
        );
        deckData.cardsInDeck.push(cardInDeck);
      } catch (error) {
        deckData.cardsNotFound.push(matchesArray[0][2]);
      }
    }
  }

  return deckData;
};

export default importDeck;
