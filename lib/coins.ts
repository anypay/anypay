
import { Coin } from '../lib/models';

import { emitter } from '../lib/events';

var coins = [];

export async function refreshCoins() {

  coins = await Coin.findAll();

  emitter.emit('coins.refreshed');

}

export async function initFromConfig(coinsConfig) {

  for (var i=0; i<coinsConfig.length; i++) {

    let coin = coinsConfig[i];

    let existingCoin = await Coin.findOne({ where: { code: coin.code }});

    if (!existingCoin) {

      await Coin.create(coin);

    }

  }

  await refreshCoins();

  emitter.emit('coins.initialized');

}

export async function getCoins() {

  emitter.emit('coins.requested');

  return coins;

}

export async function deactivateCoin(code) {

  let coin = await Coin.findOne({ where: { code }});

  coin.unavailable = true;

  await coin.save();

  await refreshCoins();

  emitter.emit('coins.deactivated', { code });

}

export async function activateCoin(code) {

  let coin = await Coin.findOne({ where: { code }});

  coin.unavailable = false;

  await coin.save();

  await refreshCoins();

  emitter.emit('coins.activated', { code });

}

