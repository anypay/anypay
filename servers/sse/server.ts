const express = require('express')
const serveStatic = require('serve-static')
const SseStream = require('ssestream')

import * as uuid from 'uuid'

import { models, log } from '../../lib'

import { Actor } from 'rabbi'

Actor.create({

  exchange: 'anypay:invoices',

  routingkey: 'invoice:paid',
  
  queue: 'sse_invoice_paid'

})
.start((channel, msg, json) => {

  log.info(msg.content.toString());

  console.log('invoice paid', msg.content.toString())

  subscriptions.handleInvoicePaid(msg.content.toString())

  channel.ack(msg)

})

class InvoiceSubscriptions {

  subscriptions: any = {};

  invoices: any = {};

  subscribeInvoice(client, invoice) {

    console.log('subscribe', { client: client.uid, invoice })

    this.subscriptions[client.uid] = invoice;

    if (!this.invoices[invoice]) {

      this.invoices[invoice] = [];

    }

    this.invoices[invoice].push(client);
  }

  handleInvoicePaid(invoice) {
    console.log('invoice paid', invoice)

    if (this.invoices[invoice]) {
      console.log('invoice', invoice)

      this.invoices[invoice].forEach(async (client) => {

        console.log('client', client.uid)

        let data = await models.Invoice.findOne({ where: { uid: invoice }})

        client.write({
          event: 'paid',
          data
        })

        subscriptions.unsubscribeClient(client)

      });

      setTimeout(function() {

        if (this.invoices && this.invoices[invoice]) {

          delete this.invoices[invoice];
        }

      }, 10000); // remove from map in ten seconds

    }
  }

  unsubscribeClient(client) {

    let invoice = this.subscriptions[client.uid];

    if (this.invoices[invoice]) {

      this.invoices[invoice] = this.invoices[invoice].filter(c => {

        return c.uid !== client.uid;

      });

    }

    delete this.subscriptions[client.uid];

  }

  getSubscriptions() {

    return this.subscriptions;

  }

  getInvoices() {

    return this.subscriptions;

  }

}

let subscriptions = new InvoiceSubscriptions();  

const app = express()
app.use(serveStatic(__dirname))
app.get('/sse', (req, res) => {
  console.log('new connection')

  const sseStream = new SseStream.default(req)
  sseStream.pipe(res)
  const pusher = setInterval(() => {
    sseStream.write({
      event: 'server-time',
      data: new Date().toTimeString()
    })
  }, 1000)

  res.on('close', () => {
    console.log('lost connection')
    clearInterval(pusher)
    sseStream.unpipe(res)
  })
})

app.get('/sse/r/:uid', async (req, res) => {
  console.log('new connection')

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }})

  const sseStream = new SseStream.default(req)
  sseStream.pipe(res)

  console.log('invoice found', invoice.status)

  sseStream.uid = uuid.v4()

  if (invoice.status === 'paid') {

    sseStream.write({
      event: 'paid',
      data: invoice.toJSON()
    })

    sseStream.unpipe(res)

  } else {

    subscriptions.subscribeInvoice(sseStream, req.params.uid)

  }

  res.on('close', () => {

    subscriptions.unsubscribeClient(sseStream)
    console.log('lost connection')
    sseStream.unpipe(res)
  })
})

const port = process.env.PORT || 8020

app.listen(port, (err) => {
  if (err) throw err
  console.log(`server ready on http://localhost:${port}`)
})
