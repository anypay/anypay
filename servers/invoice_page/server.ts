
import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Handlebars from "handlebars";

import * as Vision from 'vision'

import { join } from 'path'

import { models, log } from '../../lib'


import * as korona from '../../lib/korona_pos'

/*
 *
 * Single URL to fetch Invoice
 *
 *
 */

async function Server() {

  var server = new Hapi.Server({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 8200,
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      }
    }
  });

  await server.register(Vision);

  server.views({
    engines: { html: Handlebars },
    relativeTo: __dirname,
    path: 'views'
  });

  server.route({
    method: 'POST',
    path: '/korona_pos/orders',
    handler: async (req, h) => {

      try {

        let accessToken = await models.AccessToken.findOne({
          where: {
            uid: req.query.token
          }
        })

        let account = await models.Account.findOne({ where: { id: accessToken.account_id }})

        let invoice = await korona.handleOrder(accessToken.account_id, JSON.parse(req.payload))

        console.log('INVOICE', invoice.toJSON())

        log.info('korona.order', req.payload)

        return h.view('invoice', {
          invoice: {
            uid: invoice.uid,
            amount: invoice.denomination_amount,
            business_name: account.business_name
          },
          account: account.toJSON()
        });

      } catch(error) {

        return Boom.badRequest(error.message)

      }
    }

  })



  server.route({
    method: 'GET',
    path: '/s/invoices/{uid}',
    handler: (req, h) => {

      return h.view('invoice', {
        invoice: {
          uid: req.params.uid,
          amount: 1,
          business_name: 'Mighty Moose Marts'
        },
        invoiceStr: JSON.stringify({ uid: req.params.uid })
      });
    }

  })

  return server

}


Server().then(server => {

  server.start()

})



