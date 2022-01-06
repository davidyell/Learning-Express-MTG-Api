const express = require('express');
const deckFinders = require('../src/decks/deckFinders');

const router = express.Router();

router.get('/', (request, response) => {
  response.send('<h1>This is api only</h1>');
  response.end();
});

router.get('/api/decks', (request, response) => {
  const results = deckFinders.fetchAll();

  response.json({
    decks: results,
  });
});

router.get('/api/decks/:id', (request, response) => {
  const result = deckFinders.fetchOne(request.params.id);

  if (typeof result !== 'undefined') {
    response.json(result);
  } else {
    response.status(404).json({
      error: 'Deck not found',
    });
  }
});

module.exports = router;
