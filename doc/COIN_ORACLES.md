
# Coin Oracles

Coin oracles perform actions on various chains in response to data provided by
Anypay, such as its router.

The Router service at https://github.com/anypay/router.anypay.global requires
an ORACLE_ACCESS_TOKEN environment variable for each coin it wants to route.

- BTC_ORACLE_ACCESS_TOKEN
- DASH_ORACLE_ACCESS_TOKEN
- BSV_ORACLE_ACCESS_TOKEN
- BCH_ORACLE_ACCESS_TOKEN

etc...

### Generate an oracle access token

An access token is a large random value, given one time to its creator. After
that only the hash of the token is stored on the server.

```
./bin/coin_oracles.ts --help

  Usage: coin_oracles.ts [options] [command]


  Options:

    -h, --help  output usage information


  Commands:

    create <coin>
    delete <coin>
```

### In production

To generate a token without direct access to the production database execute
the command on a live production container.

```
sudo docker exec -it api1.anypay.global ./bin/coin_oracles.ts create BTC

{ coin_oracle:
   { id: 1,
     coin: 'BTC',
     access_token_hash:
      '$2b$10$puH5u.hVeozdj7hvfBowaOLWO.qoht.iuXyYc6FMIlAJXqgbH0xAW',
     updatedAt: 2019-09-03T15:16:04.238Z,
     createdAt: 2019-09-03T15:16:04.238Z },
  access_token: 'f1a02e0b-546d-4ff5-ac73-93328b77103d' }

```

