
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/anypay/anypay?style=for-the-badge)
![Docker Pulls](https://img.shields.io/docker/pulls/anypay/anypay?style=for-the-badge)
![CircleCI](https://img.shields.io/circleci/build/github/anypay/anypay?label=Circle%20CI%20Build&style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/github/anypay/anypay?style=for-the-badge&label=coverage)
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

- HOST
- PORT
- DATABASE_URL
- AMQP_URL

##### Optional Environment Variables

- SENTRY_DSN

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
