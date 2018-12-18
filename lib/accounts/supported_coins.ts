import {Account, Address} from '../models';

import { getCoins } from '../coins';

export async function getSupportedCoins(accountId: number): Promise<any> {

  let addresses = await Address.findAll({

    where: { account_id: accountId  }

  });

  let accountCoins  = addresses.reduce((acc,address) => {
  
    acc[address.currency] = {
      code: address.currency,
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

      accountCoins[coin.code].unavailable = coin.unavailable;

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

