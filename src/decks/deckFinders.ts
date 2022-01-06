import Database from 'better-sqlite3';
import path from 'path';
import { listToArray } from './cardListConversion';
import Deck from './DeckInterface';

let dbFilename = process.env.DB;
if (dbFilename === null) {
  dbFilename = path.join(__dirname, '..', '..', 'infrastructure', 'sqlite', 'deck-builder.sqlite3');
}

const fetchAll = () => {
  const db = new Database(dbFilename, { fileMustExist: true });
  const statement = db.prepare('SELECT id, name, cards FROM decks');
  const results: Deck[] = statement.all();

  if (results.length >= 1) {
    results.forEach((value: Deck, index: number) => {
      results[index].cards = listToArray(<string>results[index].cards);
    });
  }

  return results;
};

const fetchOne = (id: string | number) => {
  const db = new Database(dbFilename, { fileMustExist: true });
  const statement = db.prepare('SELECT id, name, cards FROM decks WHERE id = ?');
  const result: Deck = statement.get(id);

  if (typeof result !== 'undefined') {
    result.cards = listToArray(<string>result.cards);
  }

  return result;
};

export {
  fetchAll,
  fetchOne,
};
