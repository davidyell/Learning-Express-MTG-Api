/* eslint-disable no-console */

import { Cards, Players, PrismaClient } from '@prisma/client';
import { faker, SexType } from '@faker-js/faker';
import _ from 'lodash';

const prisma = new PrismaClient();

const playersFixture = [
  {
    avatar: 'avatar-21f7dc9de5da2a76540c217f2d300753.jpg',
    gender: 'female',
  },
  {
    avatar: 'avatar-89cf962fc72a4e73596660d2bdb757d5.jpg',
    gender: 'male',
  },
  {
    avatar: 'avatar-917d0d7a792e9182a1e0048fbd64c02d.jpg',
    gender: 'female',
  },
  {
    avatar: 'avatar-b4ff05a8bffad45ee72e5da35e4fde12.jpg',
    gender: 'male',
  },
  {
    avatar: 'avatar-f17381cf1b22668716da44a073246079.jpg',
    gender: 'male',
  },
];

const seeder = async () => {
  // Seed some players
  console.log('> Loading players...');

  await Promise.all(
    playersFixture.map(async (player) => {
      const firstName = faker.name.firstName(player.gender as SexType);
      const lastName = faker.name.lastName(player.gender as SexType);

      await prisma.players.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email: faker.internet.exampleEmail(firstName, lastName),
          created: new Date(),
          avatar: player.avatar,
        },
      });
    }),
  );

  // Seed some decks for the players
  console.log('> Loading player decks...');

  const players = await prisma.players.findMany();
  if (players.length === 0) {
    throw Error('No players loaded, please ensure some player data exists in the database');
  }

  const cards = await prisma.cards.findMany({ take: 100 });
  if (cards.length === 0) {
    throw Error('No cards loaded, please ensure some card data exists in the database');
  }

  for (let i = 0; i < 9; i += 1) {
    const currentPlayer = _.sample(players) as Players;

    // eslint-disable-next-line no-await-in-loop
    await prisma.decks.create({
      data: {
        name: `${_.upperFirst(faker.word.adverb())} ${_.upperFirst(faker.word.noun())}`,
        player: {
          connect: { id: currentPlayer.id },
        },
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

seeder()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
