
# Bitcoin Cash

Anypay's Bitcoin Cash integration consists of several
components:

- Payment Forwarder
- Payment Monitor
- Core

## Payment Monitor

Observes the Bitcoin Cash network traffic and blockchain,
reporting on newly broadcast and confirmed transactions.

Publishes event messages to amqp message exchange for other
component to listen to.

### Usage

The monitor can be run by either node.js alone or in docker.

```
ts-node plugins/bch/actors/payment_monitor.ts
```

```
docker run anypay/core ts-node ./plugins/bch/actors/payment_monitor.ts
```

# Payment Forwarder
