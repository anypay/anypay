# Anypay Vending

Anypay owns and operates kiosks providing sales of digital bitcoins for cash.
Here we provide actors for rpc-based wallets as back end for vending machines.
Configure the general bytes kiosk back end at https://gb.anypayinc.com to point
to this as JSON RPC.

## Actors

### Send To Address Actor

The `sendtoaddress` actor allows any other actor to send Bitcoin SV to any
address from the hot wallet provided by `VENDING_HOT_WALLET_BSV`.

At a lower level clients send publish a message to the actor with the following
properies:

- address
- amount
- uid

Address is any valid Bitcoin address.
Amount is any amount of Bitcoin in terms of BSV (not satoshis).
Uid is a unique identifier for matching a response from the Bitcoin network.

At a higher level a client library allows for json-rpc-style requests over
rabbitmq but abstracting away everything.

```

import { sendtoaddress } from './lib/wallet';

try {

  let response = await sendtoaddress(address, amount);

  console.log(response) // txid

} catch(error) {

  console.log(error.message) // sometimes they happen

}

```

### JSON RPC Actor

### Library

The library exposes two methods, one core `sendtoaddress` method which wraps
amqp, handling all response queues, amqp errors, etc.

The second method is `rpc_sendtoaddress` which is an example rpc client call
to the json rpc actor.

