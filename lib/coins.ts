
import { models } from '../lib/models';

import { events } from '../lib/events';

var coins = [];

export async function refreshCoins() {

  coins = await models.Coin.findAll();

  events.emit('coins.refreshed');

}

export async function initFromConfig(coinsConfig) {

  for (var i=0; i<coinsConfig.length; i++) {

    let coin = coinsConfig[i];

    let existingCoin = await models.Coin.findOne({ where: { code: coin.code }});

    if (!existingCoin) {

      await models.Coin.create(coin);

    }

  }

  await refreshCoins();

  events.emit('coins.initialized');

}

export async function getCoins() {

  events.emit('coins.requested');

  return coins;

}

export async function deactivateCoin(code) {

  let coin = await models.Coin.findOne({ where: { code }});

  coin.unavailable = true;

  await coin.save();

  await refreshCoins();

  events.emit('coins.deactivated', { code });

}

export async function activateCoin(code) {

  let coin = await models.Coin.findOne({ where: { code }});

  coin.unavailable = false;

  await coin.save();

  await refreshCoins();

  events.emit('coins.activated', { code });

}

export function getCoin(code: string) {

  return coins.find(coin => coin.code === code);

}

