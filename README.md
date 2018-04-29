
## Configuration

Configuration of the application is done via environment variables

- BLOCKCYPHER_API_KEY
- BLOCKCYPHER_API_SECRET
- BLOCKCYPHER_BITCOIN_FEE
- BLOCKCYPHER_DASH_FEE
- DATABASE_URL
- AMQP_URL
- FORWADING_SERVICE_URL

## Enabling Features

- set environment variable `ANYPAY_FEATURE_BITCOINCASH=1` to enable support
for bitcoin cash

## Generating API Documenation

To generate API documenation locally with swagger you must run the REST API process.

First set the DATABASE_URL to a valid postgresql database, as outlined below.

Then run `node servers/rest_api/server.js` and navigate your browser to `http://localhost:8000/documentation`.

The JSON schema used to generate Swagger clients is then available at `http://localhost:8000/swagger.json`.

Setting the `PORT` environment variable to something other than 8000 will allow use of a different http port.

## Running the Tests

Ideally every piece of the application will have accompanying tests to increase
the security, availability and quality of the software.

#### Configuring the Postgres Database for Testing

The tests require a postgres database to be created.
Install postgres and create a database named `anypay_test`.

```
psql
postgres> create database anypay_test;
```

Then export the `DATABASE_URL` connection string as an environment variable. 

```
export DATABASE_URL=postgres://postgres:@127.0.0.1:5432/anypay_test
```

Note that the connection string format is as follows:

```
postgres://{postgres_user}:{postgres_password}@{host}:{port}/{database_name}
```
Depending on your system configuration you may need to chance `postgres_user`
and `postgres_password`.

#### Install Mocha

Finally install the javascript testing framework `mocha`

```
npm install -g mocha
```

#### Runnig The Tests

Now you can run the tests with `npm test`!

`npm test` is defined in the `package.json` file under `scripts`. It runs mocha
on all tests under the `/test` directory of the project.

#### Write Your Own Tests

For more information on how to write tests, please see
[https://mochajs.org/#getting-started](https://mochajs.org/#getting-started)

