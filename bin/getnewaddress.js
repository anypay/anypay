#!/usr/bin/env node

const DashCore = require('../lib/dashcore');

DashCore.getNewAddress()
	.then(console.log)
	.catch(console.error);
