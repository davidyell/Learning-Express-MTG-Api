# Magic the Gathering Deck App
A project to learn Node.js, Express.js and Typescript

## What?
It provides a crud [OpenAPI](https://swagger.io/resources/open-api/) json web service with a few endpoints for building Magic the Gathering decks.

Endpoints are documented in the [openapi.yml](https://github.com/davidyell/Learning-Express-MTG-Api/blob/main/openapi.yaml) file in the root of the project.

### Visualise the api
You can import the yaml into the Swagger editor to visualise the api.

* Visit https://editor-next.swagger.io/
* File > Import URL
* Enter `https://raw.githubusercontent.com/davidyell/Learning-Express-MTG-Api/main/openapi.yaml`

## Installation
For *first time* install, after the dependancies, you'll need to populate the database with some data.

* Install the dependancies with `yarn install`
* Generate the Prisma orm client `yarn prisma generate`
* Copy the `.env.example` file to `.env` and update your database path
* Create the database schema `yarn prisma db push`
* Insert the card data from `infrastructure/sql` using sqlite3 cli, `.read ./infrastructure/sql/import-all.sql` and wait for it finish (roughly 3 minutes).
* Seed some players and decks `yarn prisma db seed`
* Run the dev server `yarn run dev`
* Visit http://localhost:3001/api/decks or send a request from [Postman](https://www.postman.com/downloads/) to see some MtG decks

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

:thumbsup: [Node.js](https://nodejs.org/en/about/)

:zap: [Typescript](https://www.typescriptlang.org/)  

:earth_africa: [Express](https://expressjs.com/)  

:mortar_board: I bought an excellent Typescript course on Udemy. [Understanding TypeScript - 2022 Edition](https://www.udemy.com/course/understanding-typescript/)

:tv: They also have a great YouTube channel [Academind](https://www.youtube.com/academind)

# :hammer_and_wrench: TODO
 - [x] Setup correct auto-reload and restart Express when files change in package.json
 - [x] Normalise the database to separate cards and counts
 - [ ] Implement a basic Docker container
 - [ ] Automated card data download and install into database
 - [x] Allow the database to be built, rather than downloaded from the repo
 - [ ] Code for formatting api response shapes
 - [x] Aggregate count of players decks, and decks cards
 - [x] Create a deck
 - [x] Edit a deck
 - [x] Validation when creating decks - 4 card max, cast colours with no matching lands, 15 card sideboard, more than 4 lands, etc
 - [x] Specific card endpoint, for FE to see a certain card?
 - [x] Players endpoint
 - [x] Get database under 100mb by removing extra card tables and columns
 - [ ] Aggregate deck meta and persist to data storage. eg, Card type counts, mana curve, count by colour, etc
 - [ ] Validator for alternative build formats than Constructed / Standard
 - [x] Enhance validation for multi-colour cards
 - [ ] Validate decks for legality
 - [x] Github action to run tests against PRs
 - [ ] Create CI sqlite3 import script which reduces the data inserted

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
