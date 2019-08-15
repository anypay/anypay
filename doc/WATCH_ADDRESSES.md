
# Watch Addresses

Platform users may subscribe to notifications when one or more of their
addresses receives a paymet.

## Usage

### Getting an Access Token

API calls must include a HTTP Basic Auth Header containing an access token.

To obtain the access token send an HTTP request with basic auth username as your
account email address and the password as your account password.

That will return to you an access token object. Use the `uid` of the response
as your access token in subsequent request.

```
http
  .post('https://api.anypay.global/access_tokens')
  .auth(emailAddress, password)
```

the above returns a structure with uid:

```
{
  uid: 'your-access-token'
}
```

### Setup Webhook URL

Configure your account 

Send a PUT request to set your watch address webhook url. Your account may
have one single URL for all watch addresses, and can be updated at any time.

```
http
  .put('https://api.anypay.global/account/watch_address_webhook')
  .auth(TOKEN, "")
  .send({
    webhook_url: "https://somesecureurl.com"
  })
```

Authentication is provided via HTTP Basic Auth where the username is your access
token and the password is empty.

### Watch An Address

Send a POST request to watch an address and receive notifications whenever a
payment is received by that address.

```
http
  .post('https://api.anypay.global/watch_addresses')
  .send({
    address: 'XsKLFeodK9LgBUrq3zws9Qe1CjX6F4mKNY'
  })
  .auth(TOKEN, "")
```

```
interface WatchAddressPayment {
  txid: string;
  address: string;
  amount: number;
  currency: string;
  locked: boolean;
  tx_json: object;
  tx_hex: string;
}
```

The data you receive to your webhook url conforms to the `WatchAddressPayment`
interface shown above, with the following properties explained:

- txid: DASH transaction hash
- address: Address receiving the payment
- amount: Amount received to address
- currency: DASH
- locked: whether instant send successfully locked or not
- tx_json: raw transaction decoded to json from dashd
- tx_hex: raw transaction hex string

Notifications are delivered one at a time. Your system must return a HTTP success
status code in order to receive the next notification.

If you system is down or returns HTTP errors notifications will be queued until
you are back online.

