import {models} from '../models';

import { getCoins } from '../coins';

export async function getSupportedCoins(accountId: number): Promise<any> {

  let addresses = await models.Address.findAll({

    where: { account_id: accountId  }

  });

  let accountCoins  = addresses.reduce((acc,address) => {

    acc[address.currency] = {
      code: address.currency,
      currency: address.currency,
      chain: address.chain,
      name: address.currency,
      enabled: true,
      icon: `https://app.anypayinc.com/${address.currency.toLowerCase()}.png`,
      address: address.value
    }

    return acc;

  },{});

  let coins = await getCoins();

  coins.forEach(coin => {

    if (accountCoins[coin.code]) {

      accountCoins[coin.code]['name'] = coin.name;
      accountCoins[coin.code]['icon'] = coin.logo_url || `https://app.anypayinc.com/${coin.code.toLowerCase()}.png`;

      accountCoins[coin.code].unavailable = coin.unavailable;
      accountCoins[coin.code].supported = coin.supported;

    } else {

      accountCoins[coin.code] = {
        code: coin.code,
        name: coin.name,
        currency: coin.currency,
        chain: coin.chain,
        enabled: false,
        icon: coin.logo_url || `https://app.anypayinc.com/${coin.code.toLowerCase()}.png`,
        supported: coin.supported
      };

    }

  });

  return accountCoins;

}

export async function getAddress(accountId: number, currency: string) {

  let coins = await getSupportedCoins(accountId);

  if (coins[currency]) {

    return coins[currency].address;

  } else {

    return null;

  }

}

