
# Cash Back - Anypay API

04/19/19

eGifter may specify the USD amount they would like their customer
to receive in DASH when a user pays.

Specify the dollar amount back with the `cashback_amount` parameter.
Note it is an absolute USD amount not a percentage.

```
POST https://api.anypay.global/invoices

{
  "amount": 500,
  "cashback_amount": 25,
  "currency": "DASH",
  "external_id": "OCN16630877",
  "redirect_url": "https://www.egifter.com/thanks/OCN16630877",
  "webhook_url": "https://ws-anypay.egifter.com/API/v1/AnyPayNotify.aspx",
}
```

The above call will render cash back in 0.20307 DASH ($25).

