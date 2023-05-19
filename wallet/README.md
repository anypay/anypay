![](https://doge.bitcoinfiles.org/ea8205469186c12f6b23866d3ef50ab84f6f6b82dab43075e0229ab32ca6f5bc)

# Wallet Bot

Self-custody, headless wallet service that runs as a daemon process within your data center. It manages your software operation's private keys so that your apps can securely send payments on any peer to peer payments network.

## Installation and Setup

The application runs as a long-running process which should be managed by k8s, docker, or your system service manager such as systemd or similar. It may be run in a node.js environment or as an isolated docker container. The single process requires no additional services such as database servers to be run.


`docker pull anypay/wallet-bot`

## Setting Up Wallet Keys

Rather than managing your own private key generation and backup, allow wallet bot to generate keys offline and automatically output a wallet-bot.json config file for you. Simply save a copy of this file to your organizations' vaults to restore funds in case of a machine failure.



```
docker run anypay/wallet-bot new_wallet > wallet-bot.json
```

You may view with `cat wallet-bot.json` that one private key has been created for each of the supported coins.

Alternatively you may provide your own wallet keys using the Wallet Import Format (WIF) inside wallet-bot.json.

## Running the Service

To run with wallet-bot.json config file:


```
docker run \
  -v /path/to/wallet-bot.json:/etc/wallet-bot/wallet-bot.json \
  anypay/wallet-bot start
```

To run with environment variables:

```
docker run --env-file=/path/to/.env anypay/wallet-bot start
```

You may also combine some variables from one method with others from the other method.
## Configuration

Wallets and system settings may be configured by a combination of json config files, environment variables, and command line flags. All variables may be provided by either of the config variations.

## Environment Variables

*required

| Variable name                         | Description                   |
|---------------------------------------|-------------------------------|
| ANYPAY_API\_TOKEN *                     | https://anypayx.com/dashboard/developer/wallet-bot |
| SLACK_WEBHOOK\_URL							| Will receive Slack-formatted messages on certain events |
| WEBHOOK_URL									| Will receive messages on certain events |
| LOG_LEVEL									| [error, debug, info, warn] defaults to info |
| BSV_PRIVATE\_KEY                       | Private signing key to BSV wallet      |
| BTC_PRIVATE\_KEY      						| Private signing key to BTC wallet            |
| BCH_PRIVATE\_KEY      						| Private signing key to BCH wallet           |
| DASH_PRIVATE\_KEY      					| Private signing key to DASH wallet           |
| DOGE_PRIVATE\_KEY      					| Private signing key to DOGE wallet           |
| LTC_PRIVATE\_KEY      						| Private signing key to LTC wallet           |
| ZEC_PRIVATE\_KEY      						| Private signing key to ZEC wallet           |



Configuration should be provided by a file mounted at `/etc/wallet-bot/wallet-bot.json`


## Testing

To run tests run `npm run test`

## Development

To commit new code run `npm run commit`


