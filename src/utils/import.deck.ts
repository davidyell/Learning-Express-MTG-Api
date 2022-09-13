/* eslint-disable no-continue */
import { CardsInDeck, Deck } from '@prisma/client';

import fs = require('fs')
import path = require('path')
import readline = require('readline');
import prismaClient from '../../prisma/client';

type ImportedCardInDeck = {
  card_name: string | null,
  card_id: CardsInDeck['id'],
  quantity: CardsInDeck['quantity'],
  is_sideboard: CardsInDeck['is_sideboard']
}

type ImportedDeck = {
  deck: {
    name: Deck['name']
  },
  cardsInDeck: ImportedCardInDeck[]
}

const filePath = '../tests/fixtures/decks';

const findCard = async (
  cardName: string,
  quantity: number,
  sideboard: boolean,
): Promise<ImportedCardInDeck> => {
  try {
    const card = await prismaClient.card.findFirstOrThrow({
      select: { id: true, name: true },
      where: {
        name: cardName,
        // TODO: Availability etc could be a config option object
        availability: { contains: 'paper' },
      },
    });

    return {
      card_id: card.id,
      card_name: card.name,
      quantity,
      is_sideboard: sideboard,
    };
  } catch (error) {
    // TODO: Handle errors in a better way
    // TODO: How to lookup double faced cards? Like https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=540967
    throw new Error(`Tried find a card named "${cardName}" but didn't find it`);
  }
};

const importDeck = async (): Promise<ImportedDeck> => {
  const deckFile = path.resolve(__dirname, filePath, 'Izzet Murktide a Modern deck by Notoriouss.dec');
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
      deckData.cardsInDeck.push(await findCard(
        matchesArray[0][2],
        parseInt(matchesArray[0][1], 10),
        isSideboard,
      ));
    }
  }

  return deckData;
};

export default importDeck;
