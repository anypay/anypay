
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

Each invoice may have several  payment options, which can retrieved using a URL:

```
GET https://api.anypayinc.com/invoices/d3e5187c-6d3f-4d31-ac51-6c7b74326677/payment_options

//result
{
  payment_options: [
    {
      id: 45855,
      invoice_uid: "d3e5187c-6d3f-4d31-ac51-6c7b74326677",
      currency: "BSV",
      address: "19nuy1gP2f7tM8pPjMCEZatLK4Ew5qeDXD",
      amount: "0.03622",
      uri: "bitcoin:19nuy1gP2f7tM8pPjMCEZatLK4Ew5qeDXD?sv&amount=0.03622&label=Anypay HQ&avatarUrl=https://bico.media/8fb689ac8e69f222489e9732cf224bcfdc70ed532d5c35f10097bc97fe4d68f0.png",
      createdAt: "2020-03-12T13:23:07.968Z",
      updatedAt: "2020-03-12T13:23:07.968Z"
    },
    {
      id: 45856,
      invoice_uid: "d3e5187c-6d3f-4d31-ac51-6c7b74326677",
      currency: "DASH",
      address: "XdY4446H4Pfgbc77yj6ydtmvqT6ZUTN6gs",
      amount: "0.0976",
      uri: "dash:XdY4446H4Pfgbc77yj6ydtmvqT6ZUTN6gs?amount=0.0976&is=1",
      createdAt: "2020-03-12T13:23:07.968Z",
      updatedAt: "2020-03-12T13:23:07.968Z"
    },
    {
      id: 45857,
      invoice_uid: "d3e5187c-6d3f-4d31-ac51-6c7b74326677",
      currency: "BTC",
      address: "1Ko1MDEtuqPuvnySCguLqCbC2soU7UamDi",
      amount: "0.00087",
      uri: "bitcoin:1Ko1MDEtuqPuvnySCguLqCbC2soU7UamDi?amount=0.00087",
      createdAt: "2020-03-12T13:23:07.968Z",
      updatedAt: "2020-03-12T13:23:07.968Z"
    },
    {
      id: 45858,
      invoice_uid: "d3e5187c-6d3f-4d31-ac51-6c7b74326677",
      currency: "BCH",
      address: "bitcoincash:qqfeqxg5ug46lskldanjx3rr8pz9w3xfrqyye9ulh4",
      amount: "0.02611",
      uri: "bitcoincash:qqfeqxg5ug46lskldanjx3rr8pz9w3xfrqyye9ulh4?amount=0.02611",
      createdAt: "2020-03-12T13:23:07.968Z",
      updatedAt: "2020-03-12T13:23:07.968Z"
    }
  ]
}
```

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


