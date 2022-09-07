# Magic the Gathering Deck App
An example app to learn Node.js, Express.js and Typescript

## What?
It just provides a json web service with a few endpoints

Endpoints are documented in the openapi.yml file in the root of the project.

## Installation
For *first time* install, after the dependancies, you'll need to populate the database with some data.

* Install the dependancies with `yarn install`
* Generate the Prisma orm client `yarn prisma generate`
* Copy the `.env.example` file to `.env` and update your database path
* Create the database schema `yarn prisma db push`
* Insert the card data from `infrastructure/sql` using sqlite3 cli, `.read ./infrastructure/sql/import-all.sql` and wait for it finish.
* Seed some players and decks `yarn prisma db seed`
* Run the dev server `yarn run dev`
* Visit http://localhost:3001/api/decks to see some MtG decks

Options available in the `.env.example` file.

### Inserting data into the tables
I have found it easiest to insert the `sql` files using `sqlite3` on the command line. There is a batch script to import all the files. It will take a few minutes.

```bash
sqlite3 infrastructure/database.sqlite

sqlite> .read ./infrastructure/sql/import-all.sql
sqlite> .quit
```

[More information in the Sqlite docs](https://www.sqlite.org/cli.html#reading_sql_from_a_file)

----
## References

:mortar_board: Learn to play Magic the Gathering! https://magic.wizards.com/en/intro

:no_good: Not officially affiliated or endorsed by Wizards of the Coast or Magic the Gathering

:bowing_man: Thanks to MTGJSON for their free data https://mtgjson.com/downloads/all-files/


# :hammer_and_wrench: TODO
 - [x] Setup correct auto-reload and restart Express when files change in package.json
 - [x] Normalise the database to separate cards and counts
 - [ ] Implement cross-env
 - [ ] Implement a basic Docker container
 - [ ] Automated card data download and install into database
 - [x] Allow the database to be built, rather than downloaded from the repo
 - [ ] Code for formatting api response shapes
 - [x] Aggregate count of players decks, and decks cards
 - [x] Create a deck
 - [ ] Edit a deck
 - [x] Validation when creating decks - 4 card max, cast colours with no matching lands, 15 card sideboard, more than 4 lands, etc
 - [x] Specific card endpoint, for FE to see a certain card?
 - [x] Players endpoint
 - [x] Get database under 100mb by removing extra card tables and columns
 - [ ] Aggregate deck meta and persist to data storage. eg, Card type counts, mana curve, count by colour, etc
 - [ ] Validator for alternative build formats than Constructed / Standard
 - [ ] Enhance validation for multi-colour cards
 - [ ] Validate decks for legality
 - [x] Github action to run tests against PRs

 ## License

MTG Deck Building API
Copyright (C) 2022 David Yell <neon1024@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
