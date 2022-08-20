# Magic the Gathering Deck App
An example app to learn Node.js, Express.js and Typescript

## What?
It just provides a json web service with a few endpoints

Endpoints are documented in the openapi.yml file in the root of the project.

## Installation
For *first time* install, after the dependancies, you'll need to populate the database with some data.

* Install the dependancies with `yarn install`
* Generate the Prisma orm client `yarn prisma generate`
* Create the database schema `yarn prisma db push`
* Insert the card data from `infrastructure/sql` one file per table.
  * :warning: These are stored as sql to keep file size down
* Seed some players and decks `yarn prisma db seed`
* Run the dev server `yarn run dev`
* Visit http://localhost:3001/api/decks to see some MtG decks

Options available in the `.env.example` file.

### Inserting data into the tables
I have found it easiest to insert the `sql` files using `sqlite3` on the command line. However 
it does mean importing each file.

```bash
sqlite3 infrastructure/database.sqlite

sqlite> .read ./infrastructure/sql/meta.sql
```

[More information in the Sqlite docs](https://www.sqlite.org/cli.html#reading_sql_from_a_file)

----
## References

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
 - [ ] Create a deck and edit a deck
 - [ ] Validation when creating decks - 4 card max, cast colours with no matching lands, 15 card sideboard, etc
 - [x] Specific card endpoint, for FE to see a certain card?
 - [x] Players endpoint
 - [x] Get database under 100mb by removing extra card tables and columns