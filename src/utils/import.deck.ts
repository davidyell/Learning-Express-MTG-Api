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

    // TODO: Refactor this duplicated code

    // Cope with the bulk of the deck, which should be 'Quantity Name'
    const deckMatches = line.matchAll(/^([\d]){1,2}\s(.*)$/ig);
    if (deckMatches !== null) {
      const quantityAndName = [...deckMatches];
      if (quantityAndName.length > 0) {
        deckData.cardsInDeck.push(await findCard(
          quantityAndName[0][2],
          parseInt(quantityAndName[0][1], 10),
          false,
        ));
      }
    }

    // Cope with the sideboard, which should be 'SB: Quantity Name'
    const sideboardMatches = line.matchAll(/^SB:\s([\d]){1,2}\s(.*)$/ig);
    if (sideboardMatches !== null) {
      const sideboardQuantityAndName = [...sideboardMatches];
      if (sideboardQuantityAndName.length > 0) {
        deckData.cardsInDeck.push(await findCard(
          sideboardQuantityAndName[0][2],
          parseInt(sideboardQuantityAndName[0][1], 10),
          true,
        ));
      }
    }
  }

  return deckData;
};

export default importDeck;
