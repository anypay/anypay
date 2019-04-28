
# Routes

Routes forward payment from one coin to another.

The database includes a `account_routes` table that maps an input currency
to an output currency and output address.

## Data Structure 

| account_id | input_currency | output_currency | output_address                     |
|------------|----------------|-----------------|------------------------------------|
| 5          | BCH            | BSV             | 15hQ7MpGAds3mPek7fHi3JkXcipx8Sgeaa |
|            |                |                 |                                    |

## Behavior

Upon generating an address Anypay will look first for a specific address for the
currency. If no address is found it will look for an account route. When an
account route is found Anypay will generate an invoice that forwards to the
connector's address. The connector will respond by forwarding to the output
currency address.

