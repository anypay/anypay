# Anypay Oracles

Oracles in AnyPay are software agents identified by a public key RSA512.
Accounts can authorize various oracles to monitor payment networks on their
behalf and report on transactions.

Oracles sign payment messages using their RSA512 private key, including the
address, amount, currency, and hash. Oracles are authorized on a per-currency,
or per-invoice basis.

Oracles approve payments for one or more currencies. Several oracles operated
by Anypay are approved by default for all accounts.

Oracles must check in with Anypay every minute to report whether they are
currently operational. Any oracle that fails to report its status for n=5
minutes will be indicated as out of commission.

## RPC Interface

All Anypay Oracles expose a JSON RPC Interface, which can be used to interact
with the oracle.

By default the oracle must implement the `status` method, which returns
information related to the status of the oracle. That way Anypay can poll each
oracle to determine its operational status.

Common methods for oracles to implement are `addaddress` and `removeaddress`,
which register crypto addresses for monitoring and reporting of payments, and
alternatively de-registers a crypto address when complete.

## Reporting Payments

Each oracle reports notification of payments to Anypay via an amqp queue or
Anypay's JSON/RPC admin interface (not yet developed).

## Running An Oracle

Oracles are run via Docker.

