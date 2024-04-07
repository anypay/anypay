# Webhooks

Webhooks are sent for a number of events as defined in typescript and json
using zod strongly-typed schema validators

Schemas are found in the "./schemas" directory.

## Webhook Types

- invoice.created
- invoice.paid
- invoice.cancelled
- payment.confirming
- payment.confirmed
- payment.failed

### InvoiceCreatedEvent

```
// InvoiceCreatedEvent
{
  "topic": "invoice.created",
  "payload": {
    "invoice": {
      "uid": "F28WujS5X",
      "status": "unpaid",
      "quote": {
        "value": 0.01,
        "currency": "BTC"
      }
    },
    "account_id": 1177,
    "app_id": 160
  }
}
```

### InvoicePaidEvent

```
// InvoicePaidEvent
{
  "topic": "invoice.paid",
  "payload": {
    "invoice": {
      "uid": "F28WujS5X",
      "status": "paid"
    },
    "payment": {
      "chain": "BSV",
      "currency": "BSV",
      "txid": "f3752d04bee58ecbe2ab0097e75da0a4c333a4880da4f4517705ffd785c5f15f",
      "status": "confirming"
    },
    "account_id": 1177,
    "app_id": 160
  }
}
```

### InvoiceCancelledEvent

```
// InvoiceCancelledEvent
{
  "topic": "invoice.cancelled",
  "payload": {
    "invoice": {
      "uid": "s5hBTSIN2",
      "status": "cancelled"
    },
    "account_id": 1177,
    "app_id": 160
  }
}
```

### PaymentConfirmingEvent

```
// PaymentConfirmingEvent
{
  "topic": "payment.confirming",
  "payload": {
    "invoice": {
      "uid": "F28WujS5X",
      "status": "confirming"
    },
    "payment": {
      "status": "confirming",
      "chain": "BSV",
      "currency": "BSV",
      "txid": "f3752d04bee58ecbe2ab0097e75da0a4c333a4880da4f4517705ffd785c5f15f"
    },
    "account_id": 1177,
    "app_id": 160
  }
}
```

### PaymentConfirmedEvent

```
// PaymentConfirmedEvent
{
  "topic": "payment.confirmed",
  "payload": {
    "invoice": {
      "uid": "TJBAW97r_",
      "status": "paid"
    },
    "payment": {
      "chain": "BCH",
      "currency": "BCH",
      "txid": "25178f6ce43fc35cb1e5ac1d2936d89cea9cb6b98091d168c9ee5163914ba944",
      "status": "confirmed"
    },
    "confirmation": {
      "hash": "00000000000000000017fd1ddac3f5596e49bceb4aa72a4b156f85df9c75a969",
      "height": 693756
    },
    "account_id": 1026
  }
}
```

### PaymentFailedEvent

```
// PaymentFailedEvent
{
  "topic": "payment.failed",
  "payload": {
    "invoice": {
      "uid": "wadlMQzS-",
      "status": "unpaid"
    },
    "payment": {
      "chain": "DOGE",
      "currency": "DOGE",
      "txid": "18ef9e87ca8404506c4d879f77dd5d489e17808754b4ca94ad40e796dc3a674b",
      "status": "failed"
    },
    "account_id": 1177
  }
}
```