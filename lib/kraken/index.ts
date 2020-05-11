require('dotenv').config();

import * as KrakenClient from 'kraken-api';

import { database, models } from '../';

const kraken = new KrakenClient(process.env.KRAKEN_KEY, process.env.KRAKEN_SECRET);

export async function getDASHBalance() {

  let balance = await kraken.api('Balance');

  return parseFloat(balance.result.DASH);

}

export async function getBalancesBreakdown() {

  /* Available balances, meaning they are available for placing orders */

  let balances = await getBalances();

  let orders = await listOpenOrders();

  let locked = Object.values(orders.result.open).reduce((accumulator, order: any) => {

    if (!accumulator[order.descr.pair]) {

      accumulator[order.descr.pair] = 0;

    }

    accumulator[order.descr.pair] += parseFloat(order.vol);

    return accumulator;

  }, {});

  return Object.keys(balances).reduce((acc, pair) => {
    var lockedpair = pair;

    if (!pair.match(/^X/)) {
      lockedpair = `${pair}USD`;
    }

    let balance = parseFloat(balances[pair]);
    let lock = parseFloat(locked[lockedpair]) || 0;

    acc[pair] = {

      balance,

      locked: lock,

      available: balance - lock

    };
    
    return acc;

  }, {});

}


export async function getBalances() {

  let balance = await kraken.api('Balance');

  return balance.result;

}

export async function listOpenOrders(): Promise<any> {

  let openOrders = await kraken.api('OpenOrders');

  return openOrders;

}

export async function getTicker(pair) {

  let ticker = await kraken.api('Ticker', { pair });

  return ticker;

}

export async function cancelOrder(txid) {

  let result = await kraken.api('CancelOrder', { txid });

  return result;

}

export async function getOpenPositions() {

  let openPositions = await kraken.api('OpenPositions');

  return openPositions;

}

export async function listClosedOrders() {

  let closedOrders = await kraken.api('ClosedOrders');

  return closedOrders;

}

export async function listTrades(options={}) {

  options = Object.assign({
    type: 'all'
  }, options);

  let trades = await kraken.api('TradesHistory', options);

  return trades;

}

export async function getTradeBalance() {

  let balance = await kraken.api('TradeBalance');

  return balance.result;

}

export async function getUSDBalance() {

  let balance = await kraken.api('Balance');

  return parseFloat(balance.result.ZUSD);

}

export async function transferAllUSDToBank() {

  let usdBalance = await getUSDBalance();

  let withdrawal = await kraken.api('Withdraw', {
    asset: 'USD',
    key: 'TD Bank Portsmouth',
    amount: usdBalance
  });

  return withdrawal.result;

}
export async function marketSell(pair, volume) {

  let result = await kraken.api('AddOrder', {

    pair,

    type: 'sell',

    ordertype: 'market',

    volume

  }); 

  return result;

}

export async function sellStopLoss(pair, price, volume) {

  let result = await kraken.api('AddOrder', {

    pair,

    price,

    type: 'sell',

    ordertype: 'stop-loss',

    volume

  }); 

  return result;

}

export async function sellAllDASH() {

  let balance = await getDASHBalance();

  if (balance > 0) {

    let result = await kraken.api('AddOrder', {

      pair: 'DASHUSD',

      type: 'sell',

      ordertype: 'market',

      volume: balance

    }); 

    return result;

  } else {

    return;

  }

}

export async function syncAllNewTrades() {

  var newTrades = [true];

  while (newTrades.length > 0) {

    newTrades = await syncNewTrades();

    console.log(`${newTrades.length} new trades recorded`);

  }

}
  

export async function syncNewTrades() {

  let tradeCount = await database.query(`select count(*) from "KrakenTrades";`);

  let offset = parseInt(tradeCount[0][0].count)

  let response = await listTrades({ ofs: offset });

  let newTrades = await Promise.all(Object.keys(response.result.trades).map(async (tradeId) => {

    let trade = response.result.trades[tradeId];

    let [record, isNew] = await models.KrakenTrade.findOrCreate({

      where: {
        ordertxid: trade.ordertxid            
      },

      defaults: trade

    });

    if (isNew) {

      return record;
    }

  }));

  newTrades = newTrades.filter(t => !!t);

  return newTrades;

}

