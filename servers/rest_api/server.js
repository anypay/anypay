'use strict';

const Hapi = require('hapi');
const Invoice = require('../../lib/models/invoice');
const AccessToken = require('../../lib/models/access_token');
const Account = require('../../lib/models/account');
const sequelize = require('../../lib/database');
const EventEmitter = require('events').EventEmitter;
const DashCore = require('../../lib/dashcore');
const Blockcypher = require('../../lib/blockcypher');
const DashInvoice = require('../../lib/dash_invoice');
const Basic = require('hapi-auth-basic');

const WebhookHandler = new EventEmitter();

WebhookHandler.on('webhook', payload => {
	console.log('payload', payload);
});

function authorize(next) {
  // check access token, set account
  return function(request, reply) {
    console.log('AUTHORIZE', request.raw.req.headers);
    let header = request.raw.req.headers.authorization;

    console.log('authorize', header);

    if (!header) {
      return reply('Unauthorized').code(401);
    }

  }
}

const server = new Hapi.Server();
server.connection({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8000,
    routes: {
      cors: true
    }
});

const validate = function (request, username, password, callback) {
  console.log('validate username', username)
  console.log('validate password', password);
  if (!username) {
    return callback(null, false);
  }

  AccessToken.findOne({ where: {
    uid: username
  }})
  .then(accessToken => {
    if (accessToken) {
      return callback(null, true, { accessToken: accessToken });
    } else {
      return callback(null, false);
    }
  })
  .catch(callback);
};

server.register(Basic, (err) => {

  if (err) {
    throw err;
  }

  server.auth.strategy('simple', 'basic', { validateFunc: validate });

  server.route({
      method: 'GET',
      path:'/invoices/{invoice_id}',
      handler: function (request, reply) {
        console.log("get invoices");
        console.log(request.auth.credentials);

        Invoice.findOne({where: {
          uid: request.params.invoice_id
        }})
        .then(invoice => {
          if (invoice) {
            reply(invoice);
          } else {
            reply().code(404);
          }
        })
        .catch(error => reply({error}).code(500));
      }
  });

  server.route({
      method: 'POST',
      path:'/invoices', 
      config: {
        auth: 'simple',
        handler: function (request, reply) {
          console.log(request.auth.credentials);

          DashInvoice.generate({
            dash_amount: request.payload.amount,
            account_id: request.auth.credentials.accessToken.account_id
          })
            .then(invoice => {
              console.log('generated dash invoice', invoice);
              reply(invoice);
            })
            .catch(error => {
              console.error('error generating invoice', error);
              reply({error}).code(500)
            });
        }
      }
  });

  server.route({
    method: 'POST',
    path: '/accounts',
    handler: (request, reply) => {

      Account.create({
        email: request.payload.email
      })
      .then(account => {
        reply(account);
      })
      .catch(error => {
        reply({ error: error }).code(500);
      });
    }
  })

  server.route({
    method: 'GET',
    path: '/accounts/:account_uid/confirmation',
    handler: (request, reply) => {
      // email confirmation link
    }
  });

  server.route({
    method: 'POST',
    path: '/access_tokens',
    handler: (request, reply) => {

      AccessToken.create({
        account_id: request.payload.account_id
      })
      .then(accessToken => {
        reply(accessToken);
      })
      .catch(error => {
        reply({ error }).code(500);
      });
    }
  })
});

if (require.main === module) {
  // main module, sync database & start server
  sequelize.sync().then(() => {
          // Start the server
          server.start((err) => {

              if (err) {
                  throw err;
              }
              console.log('Server running at:', server.info.uri);
          });
  });

} else {
  // module is required, export server
  module.exports = server;
}

