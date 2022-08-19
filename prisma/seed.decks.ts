import {
  Cards, Players, PrismaClient,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

const prisma = new PrismaClient();

const seedDecks = async () => {
  const players = await prisma.players.findMany();
  const cards = await prisma.cards.findMany({ take: 100 });

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 9; i++) {
    // eslint-disable-next-line no-await-in-loop
    await prisma.decks.create({
      data: {
        name: `${_.upperFirst(faker.word.adverb())} ${_.upperFirst(faker.word.noun())}`,
        player_id: _.sample<Players>(players)?.id,
        created: new Date(),
        cards_in_decks: {
          create: [
            {
              card_id: _.sample<Cards>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Cards>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Cards>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Cards>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Cards>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
          ],
        },
      },
    });
  }
};

export default seedDecks;
