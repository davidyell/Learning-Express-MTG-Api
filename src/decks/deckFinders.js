const Database = require('better-sqlite3');
const path = require('path');

const dbFilename = path.join(__dirname, '..', '..', 'infrastructure', 'sqlite', 'deck-builder.sqlite3');

function fetchAll() {
    const db = new Database(dbFilename, { fileMustExist: true });
    const statement = db.prepare('SELECT id, name, cards FROM decks');
    return statement.all();
}

function fetchOne(id) {
    const db = new Database(dbFilename, { fileMustExist: true });
    const statement = db.prepare('SELECT id, name, cards FROM decks WHERE id = ?');
    return statement.get(id);
}

module.exports = {
    fetchAll,
    fetchOne
}