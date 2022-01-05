var express = require('express');
var router = express.Router();

router.get('/', function (request, response, next) {
    response.send('<h1>This is api only</h1>');
    response.end();
});

router.get('/api/decks', function(request, response, next) {
    // TODO: Implement some database lookup
    response.json({
      decks: [
          allDecks
      ]
    })
});

router.get('/api/decks/:id', function(request, response, next) {
    const id = request.params.id
    response.json(deck)
});

module.exports = router;
