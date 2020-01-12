# Instant Rewards Program For Crypto Cash

Currently hosted as container named `cashback.anypay.global` at Agorist Hosting `149.56.89.146`.

The Anypay Cashback Programme rewards people who shop with Anypay
by sending bitcoins back to them whenever they spend at high-value stores.

## Computing Cash Back

- Listen for invoices paid at a business
- Look up the raw transaction data from the transaction hash
- Parse the transaction data from the raw transaction data
- Determine the single change address (spender)
- Send some amount back to the change address


## Environment Variables

- ANYPAY_CASHBACK_BITCOIN_PROTOCOL_ADDRESS
- ANYPAY_CASHBACK_BITCOIN_PROTOCOL_WIF (optional)

- BCH_SOURCE_ADDRESS=bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp
- DASH_SOURCE_ADDRESS=Xymo4w1fDkig77VBd1s6si1mZWwKxdgXvJ

- DASH_RPC_HOST
- DASH_RPC_PORT
- DASH_RPC_USER
- DASH_RPC_PASSWORD

- BCH_RPC_USER
- BCH_RPC_PASSWORD
- BCH_RPC_HOST
- BCH_RPC_PORT

