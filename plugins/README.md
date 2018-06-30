# Anypay Plugin Architecture

The core framework calls in to the plugin to genreate an invoice.

The core framework also listens to the plugin for events.

Core                            Plugin
----                            ------
attach http handlers            <- http handler (hapi)
call generate invoice           <- define generate invoice function
broadcast payment event         <- monitor for payment
persistence library API         -> persist database records

## Attach HTTP Handlers

```

import {attachHandler} from 'anypay/http';

plugin.handlers.forEach(async handler => {
  await attachHandler(handler);
});

```
## Generate Invoice

Anypay delegates the creation of invoices to plugins, injecting the
persistence framework upon initial instantiation and configuration
of the plugin.

```
import btc from 'anypay/plugins/btc';
import anypay from 'anypay';

anypay.plugins.plug(btc);

async function anypay.generateInvoice(invoice: CreateInvoiceChangeset): Promise<Invoice> {

  let plugin = anypay.plugins.forInvoice(invoice);

  plugin.generateInvoice(invoice);
}
```

## Configuration

Each plugin maintains a `config.json` file in the plugin root directory. The configuration
file defines the following properies:

- currency
- name

