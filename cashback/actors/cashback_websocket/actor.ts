/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { RoutingKeyBindings } from './lib/routingkey_binding';
import { pg } from './lib/database';

var bindings = new RoutingKeyBindings(); 

var LatestCashbackCache = (function() {

  var lastTen = [];

  var latestCashback;
  
  return {

    setLatest: function(latest) {

      latestCashback = latest; 

      lastTen.unshift(latest);

      lastTen.slice(0, 10);

    },

    getLatest: function() {

      return latestCashback;

    }
  
  }

})();

var websockets = (() => {

  var app = require('express')();
  var cors = require('cors')
  app.use(cors())

  var http = require('http').createServer(app);

  var io = require('socket.io')(http);

  app.get('/cashback/latest', async (req, res) => {

    let limit = req.query.limit || 10

    let payments = await pg('cashback_customer_payments')
      .select('*')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    let cashbackMerchantsBusinessNames = await pg.raw('select accounts.business_name, accounts.id as account_id, cashback_merchants.id as cashback_merchant_id from cashback_merchants inner join accounts on cashback_merchants.account_id = accounts.id');

    console.log(cashbackMerchantsBusinessNames.rows);

    let map = cashbackMerchantsBusinessNames.rows.reduce((agg, item) => {

      agg[item.cashback_merchant_id] = item.business_name;

      return agg;

    }, {});

    console.log("MAP", map);

    payments = payments.map(payment => {

      payment.business_name = map[payment.cashback_merchant_id];

      return payment;

    });

    return res.json(payments);

  });


  io.on('connection', function(s){

    var socket: any = s;

    console.log('socket.connected', socket.id);

    bindings.bindSocket(socket, 'cashback.latest.updated');

    socket.emit('cashback.latest.updated', LatestCashbackCache.getLatest());

  });

  io.on('close', function(s){

    var socket: any = s; 

    console.log('socket.disconnected', socket.id);

    bindings.unbindSocket(socket);

  });

  const PORT = process.env.WEBSOCKET_PORT || 3000;

  http.listen(PORT, function(){

    console.log(`listening on *:${PORT}`);

  });

  function publish(routingKey, message) {

    let sockets = bindings.getSockets(routingKey);

    sockets.forEach(s => {

      var socket: any = s;

      var m = JSON.stringify(message);

      socket.emit(routingKey, m)

    });

  }

  return { publish }

})();



export async function start() {

  let latestCashback = await (async () => {

    let resp = await pg('cashback_customer_payments')
      .select('*')
      .orderBy('createdAt', 'desc')
      .limit(1)

    let payment = resp[0];

    console.log('PAYMENT', payment);

    resp = await pg('cashback_merchants')
      .select('account_id')
      .where('id', payment.cashback_merchant_id)
      .limit(1)
    
    let accountId = resp[0].account_id;

    resp = await pg('accounts')
      .select('business_name')
      .where('id', accountId)
      .limit(1)

    return {
      invoice_id: payment.invoice_id,
      amount: payment.amount,
      currency: payment.currency,
      txid: payment.transaction_hash,
      business_name: resp[0].business_name
    }

  })();

  LatestCashbackCache.setLatest(latestCashback);

  let actor = Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.CashbackCustomerPayment.onCreate',

    queue: 'cashback_created_update_latest',

    schema: Joi.object({
      cashback_merchant_id: Joi.number().required(),
      currency: Joi.string().required(),
      invoice_id: Joi.string().required(),
      transaction_hash: Joi.string().required(),
      amount: Joi.number().required(),
      address: Joi.number().required(),
      createdAt: Joi.date(),
      updatedAt: Joi.date()
    })

  });

  await actor.start(async (channel, msg, json) => {
    if (!json) {
      json = JSON.parse(msg.content.toString());
    }

    console.log('cashback.created', json);

    // lookup business name in database

    let merchantAccount = (await pg('cashback_merchants')
      .where('id', json.cashback_merchant_id)
      .select('account_id')
      .limit(1))[0];

    let account = (await pg('accounts')
      .where('id', merchantAccount.account_id)
      .select('business_name')
      .limit(1))[0];

    await channel.publish('rabbi', 'cashback.latest.updated', Buffer.from(

      JSON.stringify({
        invoice_id: json.invoice_id,
        currency: json.currency,
        amount: json.amount,
        txid: json.transaction_hash,
        business_name: account.business_name,
        date: json.createdAt
      })

    ));

    await channel.ack(msg);

  });

  await actor.channel.publish('rabbi', 'cashback.latest.updated', Buffer.from(
    JSON.stringify(latestCashback)
  ));


  Actor.create({

    exchange: 'rabbi',

    routingkey: 'cashback.latest.updated',

    queue: 'websocket_notify_latest_cashback_updated',

    schema: Joi.object({
      invoice_uid: Joi.string().required(),
      currency: Joi.string().required(),
      amount: Joi.string().required(),
      txid: Joi.string().required(),
      business_name: Joi.string().required(),
      date: Joi.string()
    })

  })
  .start(async (channel, msg, json) => {

    LatestCashbackCache.setLatest(json);

    console.log('cashback.latest.updated', json);

    websockets.publish('cashback.latest.updated', json);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

