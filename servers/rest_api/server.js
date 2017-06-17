'use strict';

const Hapi = require('hapi');
const Invoice = require('../../lib/models/invoice');
const sequelize = require('../../lib/database');
const EventEmitter = require('events').EventEmitter;
const DashCore = require('../../lib/dashcore');
const Blockcypher = require('../../lib/blockcypher');
const DashInvoice = require('../../lib/dash_invoice');
const uuid = require('uuid');

const WebhookHandler = new EventEmitter();

WebhookHandler.on('webhook', payload => {
	console.log('payload', payload);
});

const server = new Hapi.Server();
server.connection({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8000,
    routes: {
      cors: true
    }
});

server.route({
    method: 'GET',
    path:'/invoices/:id', 
    handler: function (request, reply) {

				Invoice.findOne().where({ uid: request.params.id })
					.then(reply)
					.catch(console.warn);
    }
});

server.route({
    method: 'POST',
    path:'/invoices', 
    handler: function (request, reply) {

				DashInvoice.generate(request.amount)
				 	.then(invoice => {
				  	reply(invoice);
				  })
				  .catch(console.warn);
    }
});

sequelize.sync().then(() => {
				// Start the server
				server.start((err) => {

						if (err) {
								throw err;
						}
						console.log('Server running at:', server.info.uri);
				});
});

