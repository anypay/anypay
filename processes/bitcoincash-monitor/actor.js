
const amqp = require('amqplib');
const AMQP_URL = 'amqp://blockcypher.anypay.global';  
const AMQP_QUEUE = 'anypay:bitcoincash:payment:received';
const Invoice = require('../../lib/models/invoice');

(async function() {

  var conn = await amqp.connect(AMQP_URL)

  var channel = await conn.createChannel();

  await channel.assertQueue(AMQP_QUEUE, {durable: true});

  channel.consume(AMQP_QUEUE, async (message) => {
    console.log(message);
    var payment = JSON.parse(message.content.toString());

    var params = {
      currency: payment['currency'],
      address: payment['address']
    };

    var currency = payment.currency;
    console.log("CURRENCY", currency);

    console.log('PAYMENT', payment);
    console.log('PARAMS', params);

    var invoice = await Invoice.findOne({where: params});

    if (!invoice) {
      console.log('no invoice found', payment, invoice);  
      channel.ack(message);
    } else {
      console.log('found matching invoice');

      if (payment.amount >= invoice.amount) {                                         
        console.log('payment.amount', payment.amount);
        console.log('invoice.amount', invoice.amount);
                                                                                  
        await invoice.updateAttributes({                                                     
          status: "paid",                                                       
          hash: payment.hash,
          paidAt: new Date()                                                    
        });
        channel.sendToQueue("invoices:paid", Buffer.from(invoice.uid));
      } else {
        console.log('insufficient amount', `invoice|${invoice.amount}
payment|${payment.amount}`);
      }

      channel.ack(message);
    }

  }, { noAck: false });

})();


