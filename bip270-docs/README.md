# Bitcoin SV Payment Protocol

## Messages

The wallet and server will exchange a total of three messages before
the entire transaction is complete. To begin the wallet detects a URI
containing the URL of a payment request. 

Find the payment request URL by searching any data for the query
parameter `?r=https://somedomain.com/pay/12345`. Basically look for
the `r` query string parameter, then check for a URL immediately
following.

### Payment Request

Once you have a payment request URL the wallet will tell the server
that it would like to receive the corresponding payment request message
for a Bitcoin SV payment. To indicate to the server your wallet would
like to pay with Bitcoin SV attach a header field explaining so in
your request:

```
let uri = `pay:?r=https://nrgcty.com/r/3g93ksj`

let payment_request_url = parse_payment_request_url(uri);

http
  .get(payment_request_url)
  .set({
    'accept': 'application/bitcoin-sv-payment-request'
  })
```

The server will reject any request that does not contain the content-type
header `application/bitcoin-sv-payment-request`.

Upon successful response your wallet will see that the response contains
the header content type `application/payment-request`. 

Now for the details of the payment request. Our server will require
one or more specific outputs to be included in your transaction.
Generally an Output will contain two manadatory fields and one optional
field describing its purpose.

```
Output {
  amount // number. required.
  script // string. required. hexadecimal script.
  description // string. optional. must not have JSON string length of greater than 100.
}
```

| Field        | Purpose           |
| ------------- |:-------------:|
| amount      | Number of satoshis (0.00000001 BTC) to be paid.
| script      | A "TxOut" script where payment should be sent, formatted as a hexadecimal string.
| description | An optional description such as "tip" or "sales tax". Maximum length is 50 characters.

Before we get too carried away though let's take a look at the remaining fields
your wallet will receive in the payment request. These fields should always be validated
before proceeding. Specifically check that the `creationTimestamp` is valid and in
the past, as well as the `expirationTimestamp` is in the future (has yet to occur).
Of course make sure the `network` property says `bitcoin-sv`.

```
PaymentRequest {
    network // string. required. always set to "bitcoin".
    outputs // an array of outputs. required, but can have zero elements.
    creationTimestamp // number. required.
    expirationTimestamp // number. optional.
    memo // string. optional.
    paymentUrl // string. required.
    merchantData // string. optional.
}
```

Your wallet has everything it needs to construct the output transaction.
Next get together the inputs you would like to use for the payment and
construct a transaction, adding in each output.

Follow along here with an example of using the popular `bsv` library from Money Button
to construct a payment.

```
import * as bsv from 'bsv';

let payment_request = {
  network: 'bitcoin-sv',
  outputs: [

  ]
}

```


### Payment

### Payment Ack

