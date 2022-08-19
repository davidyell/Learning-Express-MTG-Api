import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/api/decks', async (request: Request, response: Response) => {
  const results = await prisma.decks.findMany({
    include: {
      player: true,
    },
  });

  response.json(results);
});

router.get('/api/decks/:id', async (request: Request, response: Response) => {
  const result = await prisma.decks.findUniqueOrThrow({
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

  response.json(result);
});

export default router;
