
# Anypay Integration Guide

So you want your own digital coins to circulate as money
in the retail economy. After much research you discovered
that Anypay is the simplest, most fun point of sale app
for digital cash. Now you are ready to roll up your sleeves
and integrate, so there are a few steps you need to take. 

## About Anypay Invoices

At checkout in a retail business Anypay generates an invoice
with a unique address to identify the customer's payment.
The address information is encoded in a URI and corresponding
QR code to communicate properly with the customer's wallet.
The URI includes the price of the currency denominated in
the fiat currency of the business manager's choosing.

For payments in your coin to be effectively communicated
and identified your system must be able to generate unique
addresses for every single payment. Most crypto currency
systems use hierarchically-derived public key addresses,
while others use a single account plus some random nonce.

Once a customer scans the invoice and sends payment in the
correct amount, Anypay will detect payment. For a correct
payment, the system will designate that invoice as paid,
and notify the cashier and customer of successful payment.
In the case of under-payment or over-payment the customer
and cashier will be notified of the disparity.

## Coin Integration API

Since you are the master of your coin's logical and func-
tional domain you are responsible for everything related
to your coin, and provide the various functions with
an authenticated HTTP-based service.

The service you implement will expose several endpoints
for initial system-wide setup of your coin, configuring
a new business to accept your coin, generating new
addresses for each customer payment, and notifying Anypay
of new payments for an invoice.

### Initial Coin Setup

You will provide a single URL for your coin's integration
service, which will respond to the various requests.

In this example we will construct a service that provides
Dogecoin (DOGE) at the following URL.

`https://dogeforretail.com/api/anypay-integration`

#### Coin Info and Logo

The coin has a name and a currency code, as well as a
logo displayed to the business manager and customers
during normal day-to-day use.

`GET /coininfo`

- logo - url of image file to display as logop
- name - long-form name of coin (ex: Dogecoin)
- code - currency code (DOGE, BCH, etc)

Response:
```
{
  "coin": {
    "logo": "https://dogeforretail.com/coinlogo.png",
    "name": "Dogecoin",
    "code": "DOGE"
  }
}
```

#### Prices

Anypay simplifies accepting new forms of money by auto-
matically calculating the amount to pay given a price
in terms of a more familiar asset, JPY or EUR for
example. In order to do that we must understand what the
current price of your asset is. Do not worry about
maintaining prices in terms of all currencies, your
coin may have a single price to a well-known asset in
which case we will compute the price based on our
existing price table.

`
GET /prices
`

Response:
```
{
  "prices": {
    "DOGE/EUR": 8177.2,
    "DOGE/JPY": 2134343983.33,
    "DOGE/USD": 6812.33
   }
}
```

### Business Public Key Address Validation

For simplicity Anypay avoids holding on to customer funds
in any long-term custodial fashion by acting as a router
for payments from the customer to the merchant. Business
managers provide the payment addresses to which they would
like to receive settlements. Then Anypay instantly routes
payments from the customer to this payment address.

Upon initial business setup the payment address must be
properly validated in order to ensure payments are routed
correctly to to the business's own wallet. This address
generally remains the same during the lifetime of a given
business's operation with Anypay, unless they decide to 
update it from time to time.

`
POST /addresses/Dg33I3211HHg9F839ym3F399f17yekk
`

Response:
```
{
  "valid" : false
}

or 

{
  "valid" : true
}

```

## Routing Payments to Unique Addresses

Now to the bulk of the behavior your integration service
provides to Anypay, generating unique addresses, detecting
payment at that address, forwarding the payment along to
the business's wallet, and notifying Anypay of payment success.

