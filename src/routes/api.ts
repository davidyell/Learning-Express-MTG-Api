import { Router, Request, Response } from 'express';
import { index as DeckIndex, view as DeckView } from '../controllers/decks.controller';
import { view as CardView } from '../controllers/cards.controller';

const router = Router();

router.get('/api/decks', (request: Request, response: Response) => {
  DeckIndex(request, response);
});

router.get('/api/decks/:id', (request: Request, response: Response) => {
  DeckView(request, response);
});

router.get('/api/cards/:id', (request: Request, response: Response) => {
  CardView(request, response);
});

export default router;
