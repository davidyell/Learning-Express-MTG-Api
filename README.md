# Magic the Gathering Deck App
An example app to learn Express.js

## Docker

### Node.js
Build the Node.js image
`docker build -t mtg-express-api:1.0.0 -f ./infrastructure/node/Dockerfile --no-cache .`

Run the container
`docker run -p 3000:3000 -d --name mtg-express-api mtg-express-api:1.0.0`

### MongoDB
Build the Node.js image
`docker build -t mtg-mongodb:1.0.0 -f ./infrastructure/mongodb/Dockerfile --no-cache .`

Run the container
`docker run -d --name mtg-mongodb mtg-mongodb:1.0.0`