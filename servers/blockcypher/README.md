
# Blockcypher Oracle Server

This http/json web server receives POST messages from Blockcypher, specifically
`PaymentForwardCallback` messages.

Generally it parses the message, sends it into a rabbitmq exchange, saves it
to a database, and returns success to Blockcypher.

