# [1.7.0](https://github.com/anypay/anypay/compare/v1.6.2...v1.7.0) (2022-10-11)


### Features

* **broadcast-nownodes:** broadcast BTC transactions to nownodes api $20/mo ([#1109](https://github.com/anypay/anypay/issues/1109)) ([f0af986](https://github.com/anypay/anypay/commit/f0af98610b37ff65056d7aab8bb2cda7503172c5))

## [1.6.2](https://github.com/anypay/anypay/compare/v1.6.1...v1.6.2) (2022-10-04)


### Bug Fixes

* **types:** use Algorithm type instead of string, explicitly ([#1102](https://github.com/anypay/anypay/issues/1102)) ([7b3053a](https://github.com/anypay/anypay/commit/7b3053a4ef398d1152c7fe278d55b95f40e8cbce))

## [1.6.1](https://github.com/anypay/anypay/compare/v1.6.0...v1.6.1) (2022-10-04)


### Bug Fixes

* **update-jsonwebtoken-version:** v8.3.0 apparently did not work on linux node v16 ([#1101](https://github.com/anypay/anypay/issues/1101)) ([891e4c8](https://github.com/anypay/anypay/commit/891e4c867adf76db9fdbd3e2171ea10143e25d02))

# [1.6.0](https://github.com/anypay/anypay/compare/v1.5.0...v1.6.0) (2022-10-02)


### Features

* **check-confirmations:** check XMR payments for confirmations and r… ([#1087](https://github.com/anypay/anypay/issues/1087)) ([c551da6](https://github.com/anypay/anypay/commit/c551da6696691293287058265ef78a8d01e39257))

# [1.5.0](https://github.com/anypay/anypay/compare/v1.4.0...v1.5.0) (2022-09-06)


### Features

* **connect-wallet-bot:** connect Wallet Bot Via Access Tokens API ([bd54294](https://github.com/anypay/anypay/commit/bd54294f2660542d20e05a12deba594ddec99afd))

# [1.4.0](https://github.com/anypay/anypay/compare/v1.3.0...v1.4.0) (2022-08-10)


### Features

* **connect-wallet-bot:** connect Wallet Bot Via Access Tokens API ([#1047](https://github.com/anypay/anypay/issues/1047)) ([425c24c](https://github.com/anypay/anypay/commit/425c24c34fe0c5adbc3d73dff6cada492d35e3d7))

# [1.3.0](https://github.com/anypay/anypay/compare/v1.2.8...v1.3.0) (2022-08-09)


### Features

* **output-addresses:** xRP, SOL, ETH, AVAX addresses plus new BTC,BCH,BSV,DASH,LTC,DOGE ([#1046](https://github.com/anypay/anypay/issues/1046)) ([e5cfaf3](https://github.com/anypay/anypay/commit/e5cfaf3c7b232baa0081ff620fc025c1108a18e4))

## [1.2.8](https://github.com/anypay/anypay/compare/v1.2.7...v1.2.8) (2022-07-30)


### Bug Fixes

* **return-uid:** after creating invoie return uid for legacy clients ([#1044](https://github.com/anypay/anypay/issues/1044)) ([c392e86](https://github.com/anypay/anypay/commit/c392e8649e018d57f792560d355840a7436679b2))

## [1.2.7](https://github.com/anypay/anypay/compare/v1.2.6...v1.2.7) (2022-07-30)


### Bug Fixes

* **webhook-url:** actually set webhook url for invoice ([ee9ff09](https://github.com/anypay/anypay/commit/ee9ff0959b7924ea28ab8c436ea588cffb841580))

## [1.2.6](https://github.com/anypay/anypay/compare/v1.2.5...v1.2.6) (2022-07-29)


### Bug Fixes

* **webhook-url:** actually set webhook url for invoice ([#1038](https://github.com/anypay/anypay/issues/1038)) ([4ae4d41](https://github.com/anypay/anypay/commit/4ae4d412e0d7d4a80bc3ea11ef6880670c614001))

## [1.2.5](https://github.com/anypay/anypay/compare/v1.2.4...v1.2.5) (2022-07-28)


### Bug Fixes

* **readd-payment-options:** in POST /invoices API response, return payment_options ([#1035](https://github.com/anypay/anypay/issues/1035)) ([276c398](https://github.com/anypay/anypay/commit/276c3980a3637afe307080678e70be403a8777a7))

## [1.2.4](https://github.com/anypay/anypay/compare/v1.2.3...v1.2.4) (2022-07-28)


### Bug Fixes

* **failed-webhooks-bug:** fix bug when failed webhooks don't log to database ([#1033](https://github.com/anypay/anypay/issues/1033)) ([ee927f3](https://github.com/anypay/anypay/commit/ee927f3c9c30dce78f29d60f4c97263189cfd122))

## [1.2.3](https://github.com/anypay/anypay/compare/v1.2.2...v1.2.3) (2022-07-26)


### Bug Fixes

* **save-fee-rate:** persist invoice required fee rate level to database ([#1030](https://github.com/anypay/anypay/issues/1030)) ([216d8ca](https://github.com/anypay/anypay/commit/216d8ca1ac1b1a494f7678ef9234a773aa3c64b4))

## [1.2.2](https://github.com/anypay/anypay/compare/v1.2.1...v1.2.2) (2022-06-30)


### Bug Fixes

* **error-messages:** return standard badRequest error message correctly ([27b013b](https://github.com/anypay/anypay/commit/27b013b66547711195ee2e15cffb7e66609d6470))

## [1.2.1](https://github.com/anypay/anypay/compare/v1.2.0...v1.2.1) (2022-06-09)


### Bug Fixes

* **kraken-listall-fix:** fix query when no parameters are provided for kraken plugin listAll method ([2104156](https://github.com/anypay/anypay/commit/2104156555e6a358161313d1a3117fc272debb36))

# [1.2.0](https://github.com/anypay/anypay/compare/v1.1.0...v1.2.0) (2022-06-09)


### Features

* **invoice-search:** aPI to Search Invoices for Account, by txid, external_id ([#993](https://github.com/anypay/anypay/issues/993)) ([5b389aa](https://github.com/anypay/anypay/commit/5b389aaa489ecd92d7cf5932249f07345938aa6b))

# [1.1.0](https://github.com/anypay/anypay/compare/v1.0.0...v1.1.0) (2022-06-09)


### Features

* **kraken-autosell:** option to disable kraken autosell by setting autosell to null ([#992](https://github.com/anypay/anypay/issues/992)) ([517cf29](https://github.com/anypay/anypay/commit/517cf29ae1738ee726ba9b69b8c81929919fb25b))
