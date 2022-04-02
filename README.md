## Usage

```

npm install
npm link


Add to .bash_profile or envrc (for local directories)
  DATABASE_URL=postgres://username@localhost:5432/anypay_dev

Create your databases:
  psql -c "create database anypay_dev"
  psql anypay_dev -c "CREATE EXTENSION postgis" # adds type "geometry"

  psql -c "create database anypay_test"
  psql anypay_test -c "CREATE EXTENSION postgis" # adds type "geometry"


Migrate your database:
  npm run db:migrate

Seed your database:
  npm run db:seed:prices && ./bin/prices.ts update_crypto_prices

Start your server:
  anypay --api --actors --websockets --blockcypher --payments

  ___   _   _ __   ________   ___  __   __
 / _ \ | \ | |\ \ / /| ___ \ / _ \ \ \ / /
/ /_\ \|  \| | \ V / | |_/ // /_\ \ \ V /
|  _  || . ` |  \ /  |  __/ |  _  |  \ /
| | | || |\  |  | |  | |    | | | |  | |
\_| |_/\_| \_/  \_/  \_|    \_| |_/  \_/

```

## Documenation


## Staging Deployment

The staging environment is available at https://api.staging.anypay.global,
which is configured to be accessed by the staging point of sale app at
https://staging.anypayinc.com.

Code is deployed to staging via the `staging` branch using the following
process.

1) Delete existing staging branch on github

`git push origin :staging`

2) Delete local staging branch

`git branch -D staging`

3) Update local master branch with latest from github

`git checkout master && git pull origin master`

4) Merge local master branch into local staging

`git checkout staging && git merge master`

5) Push staging branch to github

`git push origin staging`

At this point Circle CI will take over and build your code with the staging
environment parameters. Upon a successful build with all tests passing Circle
CI will deploy your new code to `https://api.staging.anypay.global`.

## Configuration

Configuration of the application is done via environment variables

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

```
npm test
```

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

