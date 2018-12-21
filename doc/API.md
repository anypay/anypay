# Anypay API

The Anypay API serves merchants with an invoicing service
for generating and tracking crypto currency invoices.

By itself the API is static as it includes no long-running
processes, cron jobs, daemons, etc other than the API
server itself.

The server is written in typescript with the Hapi web
server framework and is located in servers/rest_api/server.ts.

To run ANYPAY in static mode use the `--api` flag:

```
npm install
npm link
anypay --api
```

