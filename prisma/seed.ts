/* eslint-disable no-console */

import { Card, Player, PrismaClient } from '@prisma/client';
import { faker, SexType } from '@faker-js/faker';
import _ from 'lodash';
import importDeck from '../src/utils/import.deck';

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
  console.log('> Creating players...');

  await Promise.all(
    playersFixture.map(async (player) => {
      const firstName = faker.name.firstName(player.gender as SexType);
      const lastName = faker.name.lastName(player.gender as SexType);

      await prisma.player.create({
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
  console.log('> Creating random player decks...');

  const players = await prisma.player.findMany();
  if (players.length === 0) {
    throw Error('No players loaded, please ensure some player data exists in the database');
  }

  const cards = await prisma.card.findMany({ take: 100 });
  if (cards.length === 0) {
    throw Error('No cards loaded, please ensure some card data exists in the database');
  }

  for (let i = 0; i < 9; i += 1) {
    const currentPlayer = _.sample(players) as Player;

    // eslint-disable-next-line no-await-in-loop
    await prisma.deck.create({
      data: {
        name: `${_.upperFirst(faker.word.adverb())} ${_.upperFirst(faker.word.noun())}`,
        player: {
          connect: { id: currentPlayer.id },
        },
        created: new Date(),
        cards_in_decks: {
          create: [
            {
              card_id: _.sample<Card>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Card>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Card>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Card>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
            {
              card_id: _.sample<Card>(cards)?.id as number,
              quantity: parseInt(faker.random.numeric(1), 10),
              is_sideboard: _.sample<boolean>([true, false]) as boolean,
            },
          ],
        },
      },
    });
  }

  // Add a complete deck to a single player
  const player = _.sample(players) as Player;
  console.log(`> Importing valid deck to player "${player.id}"...`);

  const importedDeck = await importDeck('../src/tests/fixtures/decks/Izzet Murktide a Modern deck by Notoriouss.dec');
  await prisma.deck.create({
    data: {
      name: importedDeck.deck.name,
      player: {
        connect: { id: player.id },
      },
      created: new Date(),
      cards_in_decks: {
        create: importedDeck.cardsInDeck,
      },
    },
  });

  // Add a deck with missing cards to a single player
  console.log(`> Importing deck with missing cards to player "${player.id}"...`);

  const importedDeckWithMissingCards = await importDeck('../src/tests/fixtures/decks/Burn a Modern deck by Michael Barnes.dec');
  await prisma.deck.create({
    data: {
      name: importedDeckWithMissingCards.deck.name,
      player: {
        connect: { id: player.id },
      },
      created: new Date(),
      cards_in_decks: {
        create: importedDeckWithMissingCards.cardsInDeck,
      },
    },
  });
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
