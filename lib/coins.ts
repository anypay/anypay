
import { models } from '../lib/models';

var coins = [];

export async function refreshCoins() {

  coins = await models.Coin.findAll();

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

}

export async function getCoins() {

  return coins;

}

export async function deactivateCoin(code) {

  let coin = await models.Coin.findOne({ where: { code }});

  coin.unavailable = true;

  await coin.save();

  await refreshCoins();

}

export async function activateCoin(code) {

  let coin = await models.Coin.findOne({ where: { code }});

  coin.unavailable = false;

  await coin.save();

  await refreshCoins();

}

export function getCoin(currency: string) {

  return coins.find(coin => {
    return coin.code === currency
  });

}

