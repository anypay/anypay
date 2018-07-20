
# BCH Actors

The zeromqmonitor actor listens to new raw transactions from a bitcoin
cash full node and relays them to a rabbitmq message broker.

The `AMQP_EXCHANGE` and `AMQP_ROUTING_KEY` environment variables may be
provided to specify how messages are published into the amqp actor system.

## Actor Events

Each actor publishes a list of events it may emit, as well as events
that it binds to.
