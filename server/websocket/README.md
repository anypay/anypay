# Websocket Events

Clients connect to the websocket and subscribe to events for a given invoice.

Each websocket message has two parameters, which are both strings. For some messages the strings are encoded JSON which must be parsed got access the underlying data object.

## Invoice Paid

The websocket servers connects to rabbitmq (amqp) and consumes messages in the `invoices:paid` queue.

String:String

```
"invoice:paid" => "76665faf-22f6-4688-8d40-fe32296662db"
```

## Invoice Underpaid

The websocket servers connects to rabbitmq (amqp) and consumes messages in the `invoices:underpaid` queue.

String:JSON

```
"invoice:underpaid": {
  "uid": "76665faf-22f6-4688-8d40-fe32296662db",
  "currency": "DASH",
  "denomination": "USD",
  "amount_required": 0.12,
  "amount_paid": 0.115,
  "denomination_required": "75.5",
  "denomination_paid": 74.2,
  "payment_url": "https://chainz.cryptoid.info/dash/tx.dws?59bfc242f73993dcda64c80cdb32072b55b5118167c5dca713697b7eb38829e1.htm"
}
```

## Configuration

The following environment variables may be set:

- AMQP_URL
- AMQP_QUEUE

The AMQP_QUEUE variable indicates which queue will be consumed by the actors
