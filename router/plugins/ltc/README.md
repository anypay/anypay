# Litecoin Address Forwarding Service

Merchants need only a single Bitcoin Cash address in order
to receive payments in all of their stores, thanks to
address forwarding.

Each time the merchant wants to receive payment for a specific
amount they set up a address forward, which maps payment
addresses to their address of choice.

A merchant is then notified when a payment is received to one
of their forwarding addresses, and is provided the details
of the payment as well as of settlement.

## Events

- addressforward.created
- addressforwardcallback.sent
- addressforwardcallback.failed
- transaction.created

## Configuration

- AMQP_URL
- DATABASE_URL
- LTC_RPC_HOST
- LTC_RPC_PORT
- LTC_RPC_USER
- LTC_RPC_PASS
- LTC_ZEROMQ_URL

