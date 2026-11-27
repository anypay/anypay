<p align="center">
  <img src="docs/assets/banner.svg" alt="Anypay Core Server — Anypay" width="100%" />
</p>

<p align="center">
  <a href="https://www.anypayx.com"><img src="https://img.shields.io/badge/Anypay-Bitcoin%20%26%20Stablecoin%20Payments-00AB55?style=for-the-badge&labelColor=161C24" alt="Anypay" /></a>
  <a href="https://www.npmjs.com/package/@anypay/server"><img src="https://img.shields.io/npm/v/%40anypay%2Fserver?style=for-the-badge&logo=npm&labelColor=161C24" alt="npm" /></a>
  <a href="https://hub.docker.com/r/anypay/anypay"><img src="https://img.shields.io/docker/pulls/anypay/anypay?style=for-the-badge&logo=docker&labelColor=161C24" alt="Docker" /></a>
  <a href="https://github.com/anypay/anypay/actions"><img src="https://img.shields.io/github/actions/workflow/status/anypay/anypay/build.yml?branch=main&style=for-the-badge&logo=github&labelColor=161C24" alt="Build" /></a>
  <a href="https://codecov.io/gh/anypay/anypay"><img src="https://img.shields.io/codecov/c/github/anypay/anypay?style=for-the-badge&logo=codecov&labelColor=161C24" alt="Coverage" /></a>
</p>

<p align="center">
  <a href="https://www.anypayx.com">Website</a> ·
  <a href="https://www.anypayx.com/docs">Docs</a> ·
  <a href="https://api.anypayx.com/api">API</a> ·
  <a href="https://www.anypayx.com/walletbot">WalletBot</a> ·
  <a href="https://github.com/anypay">GitHub</a>
</p>

---

## What It Is & Purpose

**Anypay Core Server** (`@anypay/server`) is the production invoice and payments API platform that powers Anypay's multi-chain Bitcoin and stablecoin payment infrastructure. Built on Node.js with TypeScript, Hapi, Prisma, and a plugin-based architecture, it creates payment invoices for merchants, generates multi-currency payment options across 15+ blockchains, monitors on-chain transactions in real-time, confirms settlements, and fires webhooks when invoices are paid.

This is the **single source of truth** for Anypay payment state: invoice creation, payment option generation, chain-specific address derivation, transaction detection, double-spend protection, payment confirmation, and merchant settlement. It orchestrates the full lifecycle from `POST /api/v1/invoices` to `invoice.paid` webhook delivery.

The platform implements **BIP70**, **BIP270**, and **JSON Payment Protocol** standards to ensure compatibility with wallets across the Bitcoin ecosystem while supporting modern EVM chains, Solana, XRP Ledger, Stellar, and native stablecoins (USDC, USDT, RLUSD).

## Why Use It

Anypay Core Server solves persistent problems in crypto merchant payments: incorrect amounts, invalid addresses, delayed confirmations, double-spend fraud, and accidental overpayments. It provides a **single unified API** that abstracts away chain-specific complexities and delivers perfect payments every time.

- **Who it's for:** Developers building payment-enabled apps, e-commerce platforms, POS systems, and financial services that need to accept Bitcoin, Ethereum, Solana, XRP, and stablecoins (USDC, USDT) with zero blockchain expertise required.
- **Where it fits:** Anypay Core Server is the **central payments engine** in the Anypay ecosystem. The [Anypay SDK](https://github.com/anypay/anypay-sdk) wraps its REST API, [web3-checkout](https://github.com/anypay/web3-checkout-vite) renders the payment UI, [WalletBot](https://github.com/anypay/walletbot) handles self-custody settlements, the [WooCommerce plugin](https://github.com/anypay/anypay-woocommerce) integrates with WordPress stores, and the [merchant app](https://github.com/anypay/merchant-app) provides mobile POS terminals — all orchestrated by this platform.

## How It Works

<p align="center">
  <img src="docs/assets/architecture.svg" alt="How Anypay Core Server works in the Anypay stack" width="100%" />
</p>

1. **Merchant creates invoice** — Your app calls `POST /api/v1/invoices` with an amount and optional denomination. The API generates a unique invoice UID and returns a universal payment URI.

2. **Invoice API generates payment options** — The platform queries real-time prices, calculates equivalent amounts across BTC, BCH, BSV, DOGE, LTC, DASH, XRP, XMR, ETH, SOL, MATIC, AVAX, and stablecoins (USDC on Ethereum, Polygon, Avalanche, Solana; USDT on the same), then delegates to chain-specific plugins to derive fresh payment addresses.

3. **Chain plugins monitor & confirm** — Modular chain plugins (`src/plugins/btc`, `src/plugins/eth`, `src/plugins/sol`, `src/plugins/xrp`, etc.) connect to Blockbook, Infura, Getblock, and native chain nodes. They listen for incoming transactions, validate amounts and destinations, detect double-spends, wait for confirmations, and report settlement.

4. **Settlement & webhooks fire** — Once a payment confirms on-chain, the invoice transitions to `paid`, the merchant's webhook receives an `invoice.paid` event with transaction details, and the payment is recorded in Postgres with full audit history. AMQP actors handle async tasks (emails, push notifications, refunds, fee detection).

The platform runs as a horizontally scalable Hapi HTTP server, a WebSocket server for real-time invoice updates, and a fleet of RabbitMQ-backed actors for event-driven workflows.

## Quickstart / How to Use It

### Run with Docker

The fastest way to run Anypay Core Server in production:

```bash
docker pull anypay/anypay
docker run -d \
  -p 5200:5200 \
  -e DATABASE_URL=postgresql://user:pass@postgres:5432/anypay \
  -e AMQP_URL=amqp://guest:guest@rabbitmq:5672 \
  anypay/anypay
```

The server starts on port `5200`. API docs are served at `http://localhost:5200/documentation`.

### Install from npm

```bash
npm install @anypay/server
```

Package name: [`@anypay/server`](https://www.npmjs.com/package/@anypay/server) · Current version: `1.9.3`

### Development Setup

Clone the repository and run locally:

```bash
git clone https://github.com/anypay/anypay
cd anypay
npm install
npx prisma generate
npx prisma db push
npm start
```

The server will start on `http://localhost:5200` (configurable via `PORT` environment variable).

### Required Environment Variables

```bash
PORT=5200                        # HTTP server port
DATABASE_URL=postgresql://...    # Postgres connection string (PostGIS required)
AMQP_URL=amqp://...             # RabbitMQ for async actors & webhooks
```

**Optional but recommended for production:**

```bash
SENTRY_DSN=...                  # Error tracking
INFURA_ETHEREUM_URL=...         # Ethereum JSON-RPC
INFURA_POLYGON_URL=...          # Polygon JSON-RPC
INFURA_AVALANCHE_URL=...        # Avalanche JSON-RPC
GETBLOCK_BTC_URL=...            # Bitcoin node
GETBLOCK_BCH_URL=...            # Bitcoin Cash node
GETBLOCK_LTC_URL=...            # Litecoin node
GETBLOCK_DOGE_URL=...           # Dogecoin node
GETBLOCK_DASH_URL=...           # Dash node
GETBLOCK_BSV_URL=...            # Bitcoin SV node
GETBLOCK_XMR_URL=...            # Monero node
```

### Core API Endpoints

```bash
# Create a new invoice
POST /api/v1/invoices
Content-Type: application/json
{
  "amount": 25.00,
  "currency": "USD",
  "webhook_url": "https://yourapp.com/webhooks/anypay"
}

# Get invoice status
GET /api/v1/invoices/{uid}

# List invoices (authenticated)
GET /api/v1/invoices

# Get payment request (BIP70/BIP270/JSON)
GET /r/{uid}

# WebSocket real-time updates
ws://localhost:5200
```

Full API reference: [https://api.anypayx.com/api](https://api.anypayx.com/api)

### Run Tests

```bash
# All tests (requires Postgres + RabbitMQ)
npm test

# Models only
npm run test:models

# Integration tests
npm run test:integration

# Generate coverage report
npm run cover
```

Tests run against Node 18 and 20 in CI with Postgres 15 (PostGIS) and RabbitMQ 3.

### Database Migrations

```bash
# Run Sequelize migrations
npm run db:migrate

# Or use Prisma
npx prisma migrate deploy

# Install PostGIS extension (required)
npm run install-postgis
```

### CLI Tools

```bash
# Start the main server
npm start

# Start WebSocket server separately
npm run websockets

# Start dev server with hot-reload
npm run dev

# Run the interactive console
npm run console
```

## Next Moves for Growth

High-leverage improvements grounded in the current state of `anypay/anypay`:

1. **Upgrade Node.js and Docker base image** — The Dockerfile uses `node:16.13.1` (EOL). Package.json specifies `>=22.0`. Align the Dockerfile to `node:22-alpine`, rebuild the production image, and verify CI passes on Node 22 to eliminate version skew and security risks.

2. **Publish Prisma schema to npm** — The Prisma schema (`prisma/schema.prisma`) is the authoritative data model for invoices, payments, accounts, apps, webhooks, and addresses. Package it as `@anypay/prisma-schema` or bundle auto-generated TypeScript types with `@anypay/server` so downstream TypeScript consumers (SDK, merchant app, internal tools) can import types directly instead of maintaining duplicate definitions.

3. **Fix Sequelize vs. Prisma dual-ORM debt** — The codebase imports from both `@prisma/client` and runs `sequelize db:migrate`. This creates schema drift risk and migration confusion. Pick one ORM (Prisma is already the package.json `@prisma/client` dependency), migrate remaining Sequelize models to Prisma, delete `sequelize-cli`, and unify schema management. Document the migration path in `MIGRATION.md`.

4. **Replace hardcoded secrets in tests with dotenv-vault or similar** — Several test files reference blockchain node URLs via environment variables that fall back to `localhost` or skip. Codify test fixture bootstrapping with `.env.test.example`, fail fast when required test secrets are missing, and document how to provision test nodes (or use public testnets) so new contributors can run the full suite without hunting for Infura keys.

5. **Automate Docker Hub publishing on release tags** — Docker pulls are tracked (`15k+` on the badge), but there's no `.github/workflows/docker-publish.yml`. Add a workflow that builds and pushes `anypay/anypay:latest` and `anypay/anypay:v{VERSION}` on GitHub release creation, tagging the image with the git tag and the npm `package.json` version. This keeps Docker Hub synchronized with npm releases and makes versioned rollbacks possible.

## Anypay Ecosystem & License

**Anypay Core Server** is part of [Anypay](https://www.anypayx.com) — Bitcoin & Stablecoin payments for business. Merchants and developers use Anypay to accept BTC, ETH, and stablecoins such as USDC, USDT, RLUSD, and NUSD through invoices, APIs, SDKs, webhooks, WooCommerce, and mobile POS.

| Project | Role |
| --- | --- |
| [anypay](https://github.com/anypay/anypay) | **Core invoice & payments API** (`@anypay/server`) — this repository |
| [anypay-sdk](https://github.com/anypay/anypay-sdk) | TypeScript SDK for browser & Node.js (`@anypay/client`) |
| [web3-checkout-vite](https://github.com/anypay/web3-checkout-vite) | Current checkout UI (`checkout.anypayx.com`) |
| [walletbot](https://github.com/anypay/walletbot) | Self-custody headless wallet for automated settlements (`@anypay/walletbot`) |
| [anypayx.com](https://github.com/anypay/anypayx.com) | Marketing site, merchant dashboard, and developer docs |
| [merchant-app](https://github.com/anypay/merchant-app) | iOS & Android point-of-sale mobile app (React Native) |
| [anypay-woocommerce](https://github.com/anypay/anypay-woocommerce) | Official WooCommerce plugin for WordPress e-commerce |
| [prices](https://github.com/anypay/prices) | Real-time crypto price aggregation service |

### Supported Chains

Bitcoin (BTC) · Bitcoin Cash (BCH) · Bitcoin SV (BSV) · Dogecoin (DOGE) · Litecoin (LTC) · Dash (DASH) · Monero (XMR) · Ripple (XRP) · Ethereum (ETH) · Solana (SOL) · Polygon (MATIC) · Avalanche (AVAX) · Stellar (XLM) · Hedera (HBAR) · Celo (CELO)

**Stablecoins:** USDC & USDT on Ethereum, Polygon, Avalanche, Solana, Stellar · RLUSD on XRP Ledger

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

**ISC License** — Free and open source.

---

<p align="center">
  <a href="https://www.anypayx.com"><img src="https://raw.githubusercontent.com/anypay/anypayx.com/master/public/logo/logo_single.svg" alt="Anypay" width="56" /></a><br/>
  <sub>Bitcoin & Stablecoin Payments For Business · <a href="https://www.anypayx.com">anypayx.com</a> · <a href="https://x.com/xanypay">@xanypay</a></sub>
</p>
