# Anypay Plugin Architecture

The core framework calls in to the plugin to genreate an invoice.

The core framework also listens to the plugin for events.

Core                            Plugin
----                            ------
attach http handlers            <- http handler (hapi)
broadcast payment event         <- monitor for payment
persistence library API         -> persist database records

## Attach HTTP Handlers

```

import {attachHandler} from 'anypay/http';

plugin.handlers.forEach(async handler => {
  await attachHandler(handler);
});

```
