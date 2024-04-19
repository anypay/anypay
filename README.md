
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/anypay/anypay?style=for-the-badge)
![NPM Version](https://img.shields.io/npm/v/%40anypay%2Fserver?style=for-the-badge)
![Docker Pulls](https://img.shields.io/docker/pulls/anypay/anypay?style=for-the-badge)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/anypay/anypay/build.yml?branch=main&style=for-the-badge)
![CircleCI](https://img.shields.io/circleci/build/github/anypay/anypay?label=Circle%20CI%20Build&style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/github/anypay/anypay?style=for-the-badge&label=coverage)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m796758888-c4f5729105cfd766ba733696?style=for-the-badge)


![](https://anypayx.s3.eu-west-3.amazonaws.com/anypay_icon_rectangle_round.png)



<h1 style="text-align: center;">Peer to Peer Payments APIs for Developers</h1>

<div style="text-align: center">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/btc_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/bch_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/bsv_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/doge_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/ltc_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/dash_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/xrp_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/xmr_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/eth_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/sol_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/matic_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/avax_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/usdc_sol_50x50.png"/ style="width:50px">
<img src="https://anypayx.s3.amazonaws.com/coin_icons/50x50/usdt_sol_50x50.png"/ style="width:50px">


</div>


## Motivation & Problem

The motivation behind Anypay is to empower all developers in the world to create apps that can transfer any kind of value on any open system. Inspired by the concept of Internet of Value where value moves freely between all networks and asset classes of the world, for a more harmonious global market society, Anypay was created to solve problems specifically in the retail payments realm.

Primarily Anypay solves problems of digital cash payments in physical and online stores, such as restaurants, cafes or online ecommerce websites, and app developers looking to ensure perfect payments within their apps. Common and persistent problems such as incorrect amounts, invalid addresses, long delays, failure to confirm, double spend fraud, accidental double payments are addressed.

## Payments Protocols

To ensure perfect payments every time Anypay implements various competing standards for payment protocols and offers a novel protocol that incorporates all command standards into a single streamlined format.

- **JSON Payment Protocol** - simplified multi-chain payment protocol developed by Bitpay
- **BIP70** - Original Bitcoin payment protocol with focus on efficiency (protobuf) and security (X.509 verification)
- **BIP270** - Simplified single coin payment protocol developed for use within Bitcoin SV economy
- **Pay:// Protocol** - Unified single URI protocol that supports all three other with flexibility for more

## Chains and Currencies

The following blockchains are supported natively by Anypay, enabling payments in their native token as well as several onchain tokens such as stablecoins.

- Bitcoin (BTC)
- Bitcoin SV (BSV)
- Bitcoin Cash (BCH)
- Dogecoin (DOGE)
- Litecoin (LTC)
- Dash (DASH)
- Monero (XMR)
- Ripple (XRP)
- Solana (SOL, USDC, USDT)
- Ethereum (ETH, USDC, USDT)
- Polygon (MATIC, USDC, USDT)
- Avalanche (AVAX, USDC, USDT)

### API Documentation
[https://anypayx.com/api](https://anypayx.com/api)


### Run with Docker

[https://hub.docker.com/r/anypay/anypay](https://hub.docker.com/r/anypay/anypay)

```
docker run -d -p 5200:5200 anypay/anypay
```

### Required Environment Variables


| Variable Name             | Default Value | Description                                                                                                    |
|---------------------------|---------------|----------------------------------------------------------------------------------------------------------------|
| AMQP_URL                  |               | The URL for the AMQP connection.                                                                               |
| NODE_ENV                  | development   | Specifies the environment mode.                                                                                |
| DATABASE\_URL              |               | The URL for the database connection.                                                                           |
| MEMPOOL\_SPACE\_FEES\_ENABLED | true          | Flag indicating if dynamic fees for BTC transactions from mempool.space are enabled.                            |
| CHAIN\_SO\_BROADCAST\_PROVIDER\_ENABLED | true  | Flag indicating if the Chain.so broadcast provider is enabled.                                                 |
| BLOCKCHAIR\_BROADCAST\_PROVIDER\_BTC_ENABLED | true | Flag indicating if the Blockchair broadcast provider for BTC is enabled.                                       |
| REQUIRED\_FEE\_RATE\_BTC     | 1             | The required fee rate for BTC transactions.                                                                    |
| REQUIRED\_FEE\_RATE\_LTC     | 1             | The required fee rate for LTC transactions.                                                                    |
| REQUIRED\_FEE\_RATE\_DOGE    | 1             | The required fee rate for DOGE transactions.                                                                   |
| REQUIRED\_FEE\_RATE\_DASH    | 1             | The required fee rate for DASH transactions.                                                                   |
| REQUIRED\_FEE\_RATE\_LTC     | 1             | The required fee rate for LTC transactions.                                                                    |
| REQUIRED\_FEE\_RATE\_BCH     | 1             | The required fee rate for BCH transactions.                                                                    |
| REQUIRED\_FEE\_RATE\_BSV     | 1             | The required fee rate for BSV transactions.                                                                    |

### Optional Environment Variables

| Variable Name                     | Default Value       | Description                                                                                          |
|-----------------------------------|---------------------|------------------------------------------------------------------------------------------------------|
| DOMAIN                            | anypayx.com         | The domain name.                                                                                    |
| ANYPAY\_AMQP\_EXCHANGE              | anypay              | The AMQP exchange name.                                                                              |
| HOST                              | 0.0.0.0             | The host address.                                                                                   |
| PORT                              | 5200                | The port number.                                                                                    |
| WEBSOCKETS\_PORT                   | 5201                | The port number for WebSockets.                                                                     |
| API\_BASE                          | https://api.anypayx.com | The base URL for the API.                                                                       |
| X509\_DOMAIN\_CERT\_DER\_PATH         |                     | The path to the X509 domain certificate in DER format.                                                |
| X509\_PRIVATE\_KEY\_PATH             |                     | The path to the X509 private key.                                                                    |
| X509\_ROOT\_CERT\_DER\_PATH           |                     | The path to the X509 root certificate in DER format.                                                  |
| FIREBASE\_SERVER\_KEY               |                     | The server key for Firebase Cloud Messaging.                                                         |
| SENTRY\_DSN                        |                     | The Data Source Name (DSN) for Sentry error tracking.                                                 |
| LOKI\_ENABLED                      | false               | Flag indicating if Loki is enabled.                                                                  |
| LOKI\_HOST                         |                     | The host address for Loki.                                                                          |
| LOKI\_LABEL\_APP                    | anypay              | The app label for Loki.                                                                             |
| LOKI\_BASIC\_AUTH                   |                     | The basic authentication token for Loki.                                                             |
| KRAKEN\_AUTOSELL\_INTERVAL         |                     | The interval for Kraken autosell.                                                                    |
| KRAKEN\_WITHDRAWAL\_KEY             |                     | The withdrawal key for Kraken.                                                                       |
| ANYPAY\_FIXER\_ACCESS\_KEY           |                     | The access key for AnyPay Fixer.                                                                     |
| ANYPAY\_SLACK\_CHANNEL\_URL          |                     | The Slack channel URL for AnyPay.                                                                    |
| ROCKETCHAT\_WEBHOOK\_URL            |                     | The webhook URL for Rocket.Chat.                                                                     |
| KRAKEN\_PLUGIN                     | false               | Flag indicating if the Kraken plugin is enabled.                                                      |
| ANYPAY\_WEBSOCKETS\_URL             | wss://wss.anypayx.com | The WebSocket URL for AnyPay.                                                                      |
| JSONWEBTOKEN\_PUBLIC\_KEY\_PATH      |                     | The path to the public key for JSON Web Token (JWT) verification.                                     |
| JSONWEBTOKEN\_PRIVATE\_KEY\_PATH     |                     | The path to the private key for JSON Web Token (JWT) signing.                                          |
| EMAIL\_SENDER                      | no-reply@anypayx.com | The email sender address.                                                                          |
| REQUIRE\_BTC\_CONFIRMATIONS         | false               | Flag indicating if BTC confirmations are required.                                                     |
| BLOCKCYPHER\_TOKEN                 |                     | The access token for BlockCypher.                                                                     |
| BLOCKCYPHER\_WEBHOOK_TOKEN         |                     | The webhook token for BlockCypher.                                                                    |
| COINMARKETCAP\_API\_KEY             |                     | The API key for CoinMarketCap.                                                                       |
| CRYPTOAPIS\_KEY                    |                     | The API key for CryptoAPIs.                                                                          |
| INFURA\_POLYGON\_URL                |                     | The URL for Infura's Polygon endpoint.                                                                |
| INFURA\_ETHEREUM\_URL               |                     | The URL for Infura's Ethereum endpoint.                                                               |
| INFURA\_AVALANCHE\_URL              |                     | The URL for Infura's Avalanche endpoint.                                                              |
| NOWNODES\_API_\KEY                  |                     | The API key for NowNodes.                                                                             |
| TEST\_AMQP\_URL                     |                     | The test AMQP URL.                                                                                    |
| TEST\_DATABASE\_URL                 |                     | The test database URL.                                                                                |
| SUDO\_PASSWORD\_HASH                |                     | The hashed password for sudo access.                                                                  |
| JSON\_PROTOCOL\_IDENTITY\_ADDRESS    |                     | The address for the JSON protocol identity.                                                           |
| JSON\_PROTOCOL\_IDENTITY\_WIF        |                     | The Wallet Import Format (WIF) for the JSON protocol identity.                                         |
| WALLET\_BOT\_APP\_ENABLED            | false               | Flag indicating if the wallet bot app is enabled.                                                      |
| WALLET_BOT\_WEBSOCKET_PORT         | 5202                | The port number for the wallet bot WebSocket.                                                         |
| ANYPAY\_ACCESS\_TOKEN               |                     | The access token for AnyPay.                                                                          |
| NOWNODES\_ENABLED                  | false               | Flag indicating if NowNodes is enabled.                                                               |
| GETBLOCK\_LTC\_URL                  |                     | The URL for GetBlock's LTC endpoint.                                                                  |
| GETBLOCK\_BTC\_URL                  |                     | The URL for GetBlock's BTC endpoint.                                                                  |
| GETBLOCK\_BCH\_URL                  |                     | The URL for GetBlock's BCH endpoint.                                                                  |
| GETBLOCK\_DASH\_URL                 |                     | The URL for GetBlock's DASH endpoint.                                                                 |
| GETBLOCK\_BSV\_URL                  |                     | The URL for GetBlock's BSV endpoint.                                                                  |
| GETBLOCK\_DOGE\_URL                 |                     | The URL for GetBlock's DOGE endpoint.                                                                 |
| ALCHEMY\_URL\_SOLANA                |                     | The URL for Alchemy's Solana endpoint.                                                                |
| SOLANA\_PHANTOM\_SEED               |                     | The seed for the Solana Phantom wallet.                                                               |
| BITCOIND\_RPC\_HOST                 |                     | The host for Bitcoind's RPC server.                                                                   |
| BITCOIND\_RPC\_USERNAME             |                     | The username for Bitcoind's RPC server.                                                               |
| BITCOIND\_RPC\_PASSWORD             |                     | The password for Bitcoind's RPC server.                                                               |
| DASH\_RPC\_URL                      |                     | The URL for Dash's RPC server.                                                                        |
| DASH\_RPC\_URL\_2                    |                     | Additional URL for Dash's RPC server.                                                                 |
| DASH\_RPC\_URL\_3                    |                     | Additional URL for Dash's RPC server.                                                                 |
| DASH\_RPC\_USERNAME                 |                     | The username for Dash's RPC server.                                                                   |
| DASH\_RPC\_PASSWORD                 |                     | The password for Dash's RPC server.                                                                   |
| BSV\_SIMPLE\_WALLET\_WIF            |                     | The Wallet Import Format (WIF) for BSV Simple Wallet.                                                  |
| BSV\_SIMPLE\_WALLET\_ADDRESS        |                     | The address for BSV Simple Wallet.                                                                    |
| TAAL\_API\_KEY                      |                     | The API key for TAAL.                                                                                 |
| BSV\_RPC\_USER                      |                     | The username for BSV's RPC server.                                                                    |
| BSV\_RPC\_PASSWORD                  |                     | The password for BSV's RPC server.                                                                    |
| BSV\_RPC\_URL                       |                     | The URL for BSV's RPC server.                                                                         |
| XMR\_RPC\_URL                       |                     | The URL for XMR's RPC server.                                                                         |
| XMR\_RPC\_USER                      |                     | The username for XMR's RPC server.                                                                    |
| XMR\_RPC\_PASSWORD                  |                     | The password for XMR's RPC server.                                                                    |
| MONERO\_WALLET\_RPC\_URL            |                     | The URL for Monero's wallet RPC server.                                                               |
| PROMETHEUS\_PASSWORD              |                     | The password for Prometheus.                                                                          |


### Development

```
git clone https://github.com/anypay/anypay
cd anypay
npm install
npm start
```

### License

```
This file is part of anypay: https://github.com/anypay/anypay
Copyright (c) 2017 Anypay Inc, Steven Zeiler

Permission to use, copy, modify, and/or distribute this software for any
purpose  with  or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

```
