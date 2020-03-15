# Anypay Router

Routes payments to one address to another address.

Routes are maintained in the core Anypay database. An
actor in this system computes an output payment given
an input message, and enqueues it for sending.

Other actors actually send outgoing payments.

Examples:

Same currency:

Bitcoin SV to Bitcoin SV

- BSV -> BSV

Different currency:

Bitcoin SV to Gold Grams

- BSV -> RVN/FREE_STATE_BANK/AUG

## Interfaces

#### Input

- currency: string
- address: string
- amount?: number

#### Output

- currency: string
- address: string
- amount?: number

#### Route

- inputs: []Input
- outputs: []Output


## Methods

##### createroute

Records a mapping in the database from inputs to outputs

##### modifyroute

Update a route for a given input

##### invalidateroute

Invalidate a route for a given input, can be undone with `modifyroute`

## Events

#### routecreated

Returns a Route

#### routemodified

Returns a Route

#### routeinvalidated

Returns a Route

## Configuration

- AMQP_URL
- DATABASE_URL 

- BSV_RPC_HOST
- BSV_RPC_PORT
- BSV_RPC_USER
- BSV_RPC_PASS
- BSV_ZEROMQ_URL

- RVN_RPC_HOST
- RVN_RPC_PORT
- RVN_RPC_USER
- RVN_RPC_PASSWORD 
