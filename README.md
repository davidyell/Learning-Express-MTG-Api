# Magic the Gathering Deck App
An example app to learn Node.js, Express.js and Typescript

## What?
It just provides a json web service with two endpoints

* /api/decks
* /api/decks/:id

Endpoints are documented in the [OpenApi file](openapi.yml)

## How?
The app only provides a dev setup currently. The following will setup the dependancies, generate the Prisma ORM client, 
and then seed some players and decks.

```bash
yarn install
yarn run prisma:generate
yarn run prisma:seed
yarn run dev

```

Server runs at http://localhost:3001/api/decks by default.

Options available in the `.env.example` file.

----
## References

:no_good: Not officially affiliated or endorsed by Wizards of the Coast or Magic the Gathering

:bowing_man: Thanks to MTGJSON for their free data https://mtgjson.com/downloads/all-files/


# :hammer_and_wrench: TODO
 - [x] Setup correct auto-reload and restart Express when files change in package.json
 - [x] Normalise the database to separate cards and counts
 - [ ] Implement cross-env
 - [ ] Implement a basic Docker container
 - [ ] Automated card data download and install into database & remove the cards db from git repo
 - [ ] Code for formatting api response shapes
 - [ ] Aggregate count of players decks, and decks cards
 - [ ] Create a deck and edit a deck
 - [ ] Validation when creating decks - 4 card max, cast colours with no matching lands, 15 card sideboard, etc
 - [x] Specific card endpoint, for FE to see a certain card?
 - [ ] Players endpoint
 - [ ] Get database under 100mb by removing extra card tables and columns