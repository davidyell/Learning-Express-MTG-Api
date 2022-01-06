const express = require('express');
const path = require('path');

const Database = require('better-sqlite3');

var router = express.Router();

router.get('/', function (request, response, next) {
    response.send('<h1>This is api only</h1>');
    response.end();
});

router.get('/api/decks', function(request, response, next) {
    const dbFilename = path.join(__dirname, '..', 'infrastructure', 'sqlite', 'deck-builder.sqlite3');

    const db = new Database(dbFilename, { fileMustExist: true });
    const statement = db.prepare('SELECT id, name, cards FROM decks');
    const results = statement.all();

    response.json({
      decks: [results]
    });
})

router.get('/api/decks/:id', function(request, response, next) {
    const id = request.params.id;
    response.json(deck);
});

module.exports = router;