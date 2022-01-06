const Database = require('better-sqlite3')
const path = require('path')
const convert = require('./cardListConversion')

const dbFilename = path.join(__dirname, '..', '..', 'infrastructure', 'sqlite', 'deck-builder.sqlite3');

function fetchAll() {
    const db = new Database(dbFilename, { fileMustExist: true });
    const statement = db.prepare('SELECT id, name, cards FROM decks');
    const results = statement.all();

    if (results.length >= 1) {
        results.forEach((value, index) => {
            results[index].cards = convert.listToArray(results[index].cards)
        })
    }

    return results
}

function fetchOne(id) {
    const db = new Database(dbFilename, { fileMustExist: true });
    const statement = db.prepare('SELECT id, name, cards FROM decks WHERE id = ?');
    const result = statement.get(id);

    if (typeof result !== 'undefined') {
        result.cards = convert.listToArray(result.cards)
    }

    return result
}

module.exports = {
    fetchAll,
    fetchOne
}