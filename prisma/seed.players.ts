import { PrismaClient } from '@prisma/client';
import { faker, SexType } from '@faker-js/faker';

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

const seedPlayers = () => {
  playersFixture.forEach(async (player) => {
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
  });
};

export default seedPlayers;
