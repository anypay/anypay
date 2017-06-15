#!/usr/bin/env node

const Blockcypher = require('../lib/blockcypher');

Blockcypher.createWebhook(process.argv[2])
	.then(console.log)
	.catch(console.error);

