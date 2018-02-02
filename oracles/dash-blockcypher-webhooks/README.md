# Dash Blockcypher Webhook Oracle

Allows an application to register addresses for webhooks from Blockcypher. The
oracle listens for and receives http POST webhook messages and emits payment
messages to the anypay payment message bus.

An application may also unregisgter an address, which will in turn remove the
Blockcypher Webhook. Therefore the oracle must maintain a database of webhook
ids and addresses. The database is a simple leveldb key/value database.

## Usage

```
docker run \
  -p 4000:3000 \
  -v /var/anypay/oracles:/var/anypay/oracles \
  anypay/payment-service ./oracles/dash-blockcypher-webhook/main.js
```

The oracle will create a leveldb file structure at
`/var/anypay/oracles/dash-blockcypher-webhook.db`.

A volume must be mounted between the host system and the container in order to
persist the data between container restarts.

## Configuration

The following environment variables can be set, with defaults:

- RPC_PORT (12333)
- REST_PORT (12334)
- DB_PATH (/var/anypay/oracles/dash-blockcypher-webhook.db)
- AMQP_URL (amqp://guest:guest@blockcypher.anypay.global:5672/)
- BLOCKCYPHER_WEBHOOK_URL (https://oracles.anypay.global/dash-blockcypher-webhooks)
- BLOCKCYPHER_TOKEN * must be provided, no default

## JSON RPC Interface

The oracle exposes a json rpc server with two methods:

- addaddress <dashaddress>
- removeaddress <dashaddress>

## Hapi REST Server Interface

The oracle exposes an http interface on the public internet to receive webhooks
from Blockcypher.

- POST /dash-blockcypher-webhooks

Validates messages from Blockcypher before pushing them into payment queue.

