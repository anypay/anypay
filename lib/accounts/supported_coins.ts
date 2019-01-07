import {Account, Address} from '../models';

import { getCoins } from '../coins';

export async function getSupportedCoins(accountId: number): Promise<any> {

  let addresses = await Address.findAll({

    where: { account_id: accountId  }

  });

  let accountCoins  = addresses.reduce((acc,address) => {
  
    acc[address.currency] = {
      code: address.currency,
      name: address.name,
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

      accountCoins[coin.code].unavailable = coin.unavailable;

    } else {

      accountCoins[coin.code] = {
        code: coin.code,
        name: coin.name,
        enabled: false,
        icon: `https://pos.anypay.global/${coin.code.toLowerCase()}.png`
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

