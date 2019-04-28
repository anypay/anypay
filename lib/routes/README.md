
# Routes

Routes forward payment from one coin to another.

The database includes a `account_routes` table that maps an input currency
to an output currency and output address.

## Data Structure 

| account_id | input_currency | output_currency | output_address                     |
|------------|----------------|-----------------|------------------------------------|
| 5          | BCH            | BSV             | 15hQ7MpGAds3mPek7fHi3JkXcipx8Sgeaa |
|            |                |                 |                                    |

## Generating Invoices

When generating an invoice Anypay will first check for an active account route
for the currency. If found, the forwarding address will be the connector's
address. If no account route is found Anypay will look for a normal address
for that currency. If an address is found for that currency payment will be
forwarded to that address.

