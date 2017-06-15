#!/usr/bin/env node
const qrCode = require('qrcode-terminal');
const DashInvoice = require('../lib/dash_invoice');
const socket = require('socket.io-client')('http://blockcypher.anypay.global:3000');
const uuid = require("uuid");
const clear = require('clear');
const figlet = require('figlet');

socket.on('connect', () => {

  DashInvoice.generate(parseFloat(process.argv[2])).then(invoice => {
		socket.emit('subscribe', {invoice: invoice.uid});

  	qrCode.generate(`dash:${invoice.address}?amount=${invoice.amount}`, {small: false});
		console.log(`dash:${invoice.address}?amount=${invoice.amount}`);

	  socket.on('invoice:paid', data => {

			clear();

			figlet('PAID!', (err, data) => {
				console.log(data);			
			});
	  });
  })
  .catch(console.warn);
});
