# Magic the Gathering Deck App
A project to learn Node.js, Express.js and Typescript

## What?
It provides a crud [OpenAPI](https://swagger.io/resources/open-api/) json web service with a few endpoints for building Magic the Gathering decks.

Endpoints are documented in the [openapi.yml](https://github.com/davidyell/Learning-Express-MTG-Api/blob/main/openapi-dist.yaml) file in the root of the project.

### Visualise the api
You can import the yaml into the Swagger editor to visualise the api.

* Visit https://editor-next.swagger.io/
* File > Import URL
* Enter `https://raw.githubusercontent.com/davidyell/Learning-Express-MTG-Api/main/openapi-dist.yaml`

## Installation
For *first time* install, after the dependancies, you'll need to populate the database with some data.

* Install the dependancies with `yarn install`
* Copy the `.env.example` file to `.env` and update your database path
* Create the database and schema `yarn prisma db push`
* Insert the card data `sqlite3 -init ./infrastructure/sql/import-all.txt ./infrastructure/database.sqlite` then `.quit` (takes about 2 mins)
* Seed some players and decks `yarn prisma db seed`
* Run the dev server `yarn run dev`
* Visit http://localhost:3001/api/decks or send a request from [Postman](https://www.postman.com/downloads/) to see some MtG decks

## Testing
Two test suites exist, a unit and integration suite. These can be run with `yarn run test:unit` and `yarn run test:integration`, or run everything with `yarn run test`

An integration testing database must be created for the integration tests to run, which can be setup with `./infrastructure/setup-test-db.sh`, you'll need to quit from `sqlite3` after the import with `.quit`

----
## References

:mortar_board: Learn to play Magic the Gathering! https://magic.wizards.com/en/intro

:no_good: Not officially affiliated or endorsed by Wizards of the Coast or Magic the Gathering

:bowing_man: Thanks to MTGJSON for their free data https://mtgjson.com/downloads/all-files/

:thumbsup: [Node.js](https://nodejs.org/en/about/)

:zap: [Typescript](https://www.typescriptlang.org/)  

:earth_africa: [Express](https://expressjs.com/)  

:card_file_box: [Rest API Tutorial](https://restfulapi.net/)

:mortar_board: I bought an excellent Typescript course on Udemy. [Understanding TypeScript - 2022 Edition](https://www.udemy.com/course/understanding-typescript/)

:tv: They also have a great YouTube channel [Academind](https://www.youtube.com/academind)

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
