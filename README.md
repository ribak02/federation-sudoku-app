## CS3099 Group 12

## Requirements

Node version 18.12.0 is used to run the application.

A `.env` file is required in the `server` directory, containing the following environment variables:

1. DB_USER
2. DB_PASSWORD
3. DB_HOST
4. DB_DATABASE
5. TOKEN_KEY
6. FEDERATION_SECRET
7. COOKIE_SECRET

## Development

The client and server are ran separately.
The client runs on port `8080` and the server runs on port `5000`.

To run the server:

1. `cd server`
2. `npm install`
3. `npm run dev`

To run the client:

1. `cd client`
2. `npm install`
3. `npm run serve`

## Production

The server statically serves the built client code, running on a single port (`5000`).

To run the application:

1. `cd client`
2. `npm install`
3. `npm run build` - this will create a `dist` folder in `client`
4. `cd ../server` - change directory to server folder
5. `npm install`
6. `node server.js`

## Testing

To run the client tests:

1. 'cd client'
2. 'npm install'
3. 'npm test'

To run the server tests:

1. 'cd server'
2. 'npm install'
3. 'npm test'

* Please note: one of the server tests fails when running on host servers however it runs successfully on lab machines. This is the "Checking comparePassword function -> returns true if hashed password and password are the same". The reason it fails is unsure. 
