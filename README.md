![](https://bitcoinfilesystem.com/44ccdab033dff03d755bfa0b3db669954b7855cd21ea167b812e758fe3987ddd)

![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/anypay/anypay?style=for-the-badge)
![Docker Pulls](https://img.shields.io/docker/pulls/anypay/anypay?style=for-the-badge)
![CircleCI](https://img.shields.io/circleci/build/github/anypay/anypay?label=Circle%20CI%20Build&style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/github/anypay/anypay?style=for-the-badge&label=coverage)

<h1 style="text-align: center;">Peer to Peer Payments APIs for Developers</h1>

### API Documentation
[https://api.anypayx.com/](https://api.anypayx.com)


### Run with Docker

[https://hub.docker.com/r/anypay/anypay](https://hub.docker.com/r/anypay/anypay)

```
docker run -d -p 5200:5200 anypay/anypay
```

### Environment

- HOST
- PORT
- DATABASE_URL
- AMQP_URL

### Running Tests

Before running the tests you will need to create a postgres server container and migrate the database schema.

#### Create Postgres Database with Docker Compose

Inside the project lives a file called docker-compose.yml with a default postgres database setup configuration.

If you have docker-compose installed already you may proceed to create the database with the following command:

```
docker-compose up -d postgres
```

To migrate the database using docker-compose first build the anypay image and then run the migration command:

```
docker-compose build server
docker-compose run server npx sequelize db:migrate --url=postgres://postgres:password@postgres:5432/anypay

```

##### Migrating Database with Npm

If you have npm installed on your system first install the dependencies and run the migration script:

```
npm install
npx sequelize db:migrate --url=postgres://postgres:password@postgres:5432/anypay
```

#### Create Postgres Database with Docker

```
docker run -d --name postgres.anypay  \
  --p 5432:5432 \
  -v ./anypay_db_data:/var/lib/postgresql/data \
  --restart=always \
  postgis/postgis:12-3.3
```

