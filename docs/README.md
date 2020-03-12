
# Anypay Integration Guide

## Authencation

All API calls to Anypay require basic authentication headers to be set
including your API key. Let the username be your api key and the password
be an empty string

Example:

```
  http
   .get(URL)
   .auth(process.env.ANYPAY_API_KEY, '')

```

## Creating Invoice

When you are ready to collect a payment you request to Anypay to create an
invoice for a specific amount, for instance $99 US dollars, and for a specific
currency, ie DASH. By default a payment option is generated for each of the
currencies available for your account, such as DASH, BCH, BSV, and BTC.

You must include the `amount` which is the fiat denominated amount, and the
`currency` which is the coin you would like to collect.

Example:

```
  let response = http
    .post('https://api.anypayinc.com/invoices') 
    .auth(API_KEY, '')
    .send({
      currency: 'BCH',
      amount: 85
    })

```
The above will generate an invoice for $85 in BCH.

## Payment Options

Each invoice may have more than one payment option.

## Checking Status of Invoice

Once you have an invoice you may retrieve the status including payment
information by making a request to the Anypay API:

```
  let invoiceUID = '109bbd2f-cb06-4e57-8b73-c1caea26ae6d';

  let response = http
    .get(`https://api.anypayinc.com/invoices/${invoiceUID}`)

```

Invoice status can be `undpaid`, `paid`, `underpaid`, or `overpaid`

Example response:

```
// GET https://api.anypayinc.com/invoices/7e4610cb-6505-42a0-bf2a-3ba8efd442aa
{
  amount: 0.83173,
  invoice_amount_paid: 0.83173,
  denomination_amount: 170,
  denomination_amount_paid: 170,
  uid: "7e4610cb-6505-42a0-bf2a-3ba8efd442aa",
  currency: "BSV",
  expiry: "2020-03-08T21:09:16.923Z",
  complete: true,
  completed_at: "2020-03-08T20:54:50.081Z",
  redirect_url: null,
  denomination_currency: "USD",
  address: "1CnVVDfMKBpSZ1RZxojfwdgzRz7tbdi3AY",
  account_id: 934,
  hash: "ef39d3c4bdf3ae70127487aa030c072a82f7188b838a2d31f5b417e05e9c04c4",
  status: "paid",
  uri: "bitcoin:1CnVVDfMKBpSZ1RZxojfwdgzRz7tbdi3AY?sv&amount=0.83173",
  paidAt: "2020-03-08T20:54:50.081Z",
  createdAt: "2020-03-08T20:54:16.923Z",
  updatedAt: "2020-03-08T20:54:50.227Z"
}
```

## Receive Invoice Payment Webhook Notification

Whenever your invoice receives a payment you may choose to receive a
webhook notification via HTTP by indicating the `webhook_url` option
when creating an invoice.

Then whenever a payment for that invoice occurs Anypay will send your
app an HTTP POST request with the invoice and payment details. The
invoice and payment details are the same as if you checked the status
of the invoice manually.


