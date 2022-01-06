# Magic the Gathering Deck App
An example app to learn Node.js, Express.js and Typescript

## What?
It just provides a json web service with two endpoints

* /api/decks
* /api/decks/:id

## How?
The app needs to be built from Typescript to run the Node server currently.

`yarn run build` to build the typescript  
`yarn run start` to start the server on http://localhost:3000/api/decks

Can also be run directly in Typescript using `yarn run ts-node ./bin/server.ts`

## Roadmap
 - [ ] Implement nodemon so it can build and serve
 - [x] Replace the existing `/bin/www` server with a Typescript version
 - [ ] Add other REST verbs
 - [ ] Create a card lookup/search endpoint with caching
 - [ ] Refactor the database to remove the need to convert comma lists into arrays
 - [ ] Add some tests
 - [ ] Build Github actions to run tests in CI

----
Not officially affiliated or endorsed by Wizards of the Coast or Magic the Gathering
