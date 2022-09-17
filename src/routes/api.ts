import { Router, Request, Response } from 'express';
import {
  index as DeckIndex,
  view as DeckView,
  create as DeckCreate,
  edit as DeckEdit,
  remove as DeckRemove,
} from '../controllers/decks.controller';
import { search as CardSearch, view as CardView } from '../controllers/cards.controller';
import { index as PlayerIndex, view as PlayerView } from '../controllers/players.controller';

const router = Router();

router.get('/api/decks', (request: Request, response: Response) => {
  DeckIndex(request, response);
});

router.get('/api/decks/:id', (request: Request, response: Response) => {
  DeckView(request, response);
});

router.get('/api/cards/search', (request: Request, response: Response) => {
  CardSearch(request, response);
});

router.get('/api/cards/:id', (request: Request, response: Response) => {
  CardView(request, response);
});

router.get('/api/players', (request: Request, response: Response) => {
  PlayerIndex(request, response);
});

router.get('/api/players/:id', (request: Request, response: Response) => {
  PlayerView(request, response);
});

router.post('/api/decks', (request: Request, response: Response) => {
  DeckCreate(request, response);
});

router.put('/api/decks/:id', (request: Request, response: Response) => {
  DeckEdit(request, response);
});

router.delete('/api/decks/:id', (request: Request, response: Response) => {
  DeckRemove(request, response);
});

export default router;
