# Magic the Gathering Deck App
An example app to learn Node.js, Express.js and Typescript

## What?
It just provides a json web service with two endpoints

* /api/decks
* /api/decks/:id

Endpoints are documented in the [OpenApi file](openapi.yml)

## How?
The app needs to be built from Typescript to run the Node server currently.

The project uses Yarn 2, so all the dependencies are cloned with the project. [What is Zero-Install?](https://yarnpkg.com/features/zero-installs)

`yarn run build` to build the typescript  
`yarn run start` to start the server on http://localhost:3001/api/decks

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