import { Router, Request, Response } from 'express';
import { fetchAll, fetchOne } from '../src/decks/deckFinders';

const router = Router();

router.get('/', (request: Request, response: Response) => {
  response.send('<h1>This is api only</h1>');
  response.end();
});

router.get('/api/decks', (request: Request, response: Response) => {
  const results = fetchAll();

  response.json({
    decks: results,
  });
});

router.get('/api/decks/:id', (request: Request, response: Response) => {
  const result = fetchOne(request.params.id);

  if (typeof result !== 'undefined') {
    response.json(result);
  } else {
    response.status(404).json({
      error: 'Deck not found',
    });
  }
});

export default router;
