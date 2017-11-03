
## Configuration

Configuration of the application is done via environment variables

- BLOCKCYPHER_API_KEY
- BLOCKCYPHER_API_SECRET
- BLOCKCYPHER_BITCOIN_FEE
- BLOCKCYPHER_DASH_FEE
- DATABASE_URL
- AMQP_URL

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

