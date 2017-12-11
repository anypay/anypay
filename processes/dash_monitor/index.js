
const Poller = require('./poller')
const Invoice = require('../../lib/models/invoice')
const AMQP_URL = 'amqp://blockcypher.anypay.global'
const amqp = require('amqplib')

Poller.start()

Poller.vent.on('received', data => {
  console.log('received', data)
})

Poller.vent.on('normalsend:received', data => {
  console.log('normalsend:received', data)
})

Poller.vent.on('instantsend:received', data => {
  console.log('instantsend:received', data)

  Invoice.findOne({ where: {address: data.address }}).then(invoice => {
    if (invoice) {
      console.log('found invoice', invoice.toJSON())

      if (invoice.status === 'paid') {
        console.log('INVOICE ALREADY PAID')
      } else {
        if (parseFloat(invoice.amount) === data.amount) {
          console.log('INVOICE PAID!')

          invoice.updateAttributes({
            status: 'paid',
            paidAt: new Date()
          })
          .then(() => {
            console.log('invoice updated', invoice.uid)

            amqp.connect(AMQP_URL).then(conn => {
              console.log('connected')

              conn.createChannel().then(channel => {
                channel.sendToQueue('invoices:paid', Buffer.from(invoice.uid))
                console.log('sent to invoices:paid', invoice.uid)
                setTimeout(() => {
                  conn.close()
                }, 10000)
              })
            })
          })
        } else {
          console.log('INVALID INVOICE AMOUNT!')
        }
      }
    }
  })
})
