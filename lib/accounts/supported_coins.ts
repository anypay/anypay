import {models} from '../models';

import { getCoins } from '../coins';
import {
  AccountAddress,
  AccountAddresses
} from '../core/types';

export async function getSupportedCoins(accountId: number): Promise<any> {

  let addresses = await models.Address.findAll({

    where: { account_id: accountId  }

  });

  let accountCoins  = addresses.reduce((acc,address) => {
  
    acc[address.currency] = {
      code: address.currency,
      currency: address.currency,
      name: address.currency,
      enabled: true,
      icon: `https://pos.anypay.global/${address.currency.toLowerCase()}.png`,
      address: address.value
    }

    return acc;

  },{});

  let coins = await getCoins();

  coins.forEach(coin => {

    if (accountCoins[coin.code]) {

      accountCoins[coin.code]['name'] = coin.name;
      accountCoins[coin.code]['icon'] = coin.logo_url || `https://pos.anypay.global/${coin.code.toLowerCase()}.png`;

      accountCoins[coin.code].unavailable = coin.unavailable;

    } else {

      accountCoins[coin.code] = {
        code: coin.code,
        name: coin.name,
        enabled: false,
        icon: coin.logo_url || `https://pos.anypay.global/${coin.code.toLowerCase()}.png`
      };

    }

    if (coin.code === 'BCH') {

      let address = accountCoins[coin.code].address;

      // Enable BCH only if xpubkey set

      if (address && address.match(/^xpub/)) {

        accountCoins[coin.code].unavailable = false;

      }

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

