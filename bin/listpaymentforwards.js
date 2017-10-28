#!/usr/bin/env node

const blockcypher = require("../lib/blockcypher");

blockcypher.listPayments().then(console.log);

