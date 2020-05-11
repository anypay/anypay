import { BigNumber } from 'bignumber.js';

import { Actor } from 'rabbi';

import { log, kraken } from '../../lib';

import * as cron from 'node-cron';

import * as http from 'superagent';

const SLACK_URL = 'https://chat.anypay.global/hooks/pupH8EqX6Hz3WCAeh/RopsnAYceWJkyoq5irtEEtZgmCCdcBiwezNNQg4sA8jCyxNF'

const RISK = 0.001;

const MINIMUM_BALANCE = 0;

export async function start() {

  /*
    DASHStopLossPlacer
    Whenever there is DASH available to be traded, create a stop-loss order
    for 10% below the current price for up to 0.1 DASH at a time
  */


  let actor = Actor.create({

    exchange: 'anypay.kraken',

    routingkey: 'order.placed',

    queue: 'notifyorderrocketchat'

  })

  actor.start(async (channel, msg) => { 

    console.log('new order placed', msg.content.toString());

    await http.post(SLACK_URL).send({
      text: msg.content.toString()
    })

    channel.ack(msg);

  });

  cron.schedule('0 * * * * *', async () => { // every minute

    await stopLossAnyNewDASH(actor.channel);

  });

}

async function stopLossAnyNewDASH(channel) {

  log.info('stopLossAnyNewDASH');

  let balances = await kraken.getBalancesBreakdown();

  let availableBalance = balances['DASH'].available;

  log.info(`kraken.balances.available.DASH:${availableBalance}`, availableBalance);

  let ticker = await kraken.getTicker('DASHUSD');

  let lastPrice = ticker.result['DASHUSD'].a[0];

  log.info(`kraken.ticker.DASH.lastprice:${lastPrice}`, lastPrice);

  let result = await kraken.sellAllDASH();

  console.log(result);
  /*

  if (availableBalance > MINIMUM_BALANCE) {

    // calculate stop loss price as maxiumum 10% drawdown
    let stopLossPrice = parseFloat((lastPrice * (1 - RISK)).toFixed(3));

    let order = await kraken.sellStopLoss('DASHUSD', stopLossPrice, availableBalance);

    log.info('kraken.order.placed.sell.stoploss', order);

    await channel.publish('anypay.kraken', 'order.placed', new Buffer(
      JSON.stringify(order)
    )); 

  }
  */

}

if (require.main === module) {

  start();

}

