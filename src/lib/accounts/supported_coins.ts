
import { getCoins } from '@/lib/coins';
import { addresses as Address } from '@prisma/client';
import prisma from '@/lib/prisma';

interface AccountCoin {
  code: string;
  currency: string;
  chain: string;
  name: string;
  enabled: boolean;
  icon: string;
  address?: string;
  supported?: boolean;
  unavailable?: boolean;
}

export interface AccountCoins {
  [key: string]: AccountCoin;
}

export async function getSupportedCoins(accountId: number): Promise<AccountCoins> {

  const addresses = await prisma.addresses.findMany({ where: { account_id: accountId }});

  let accountCoins: AccountCoins  = addresses.reduce((acc: AccountCoins,address: Address) => {

    if (address.currency !== null) {
      acc[address.currency] = {
        code: address.currency,
        currency: address.currency,
        chain: String(address.chain),
        name: address.currency,
        enabled: true,
        icon: `https://app.anypayinc.com/${address.currency.toLowerCase()}.png`,
        address: String(address.value)
      }
    }

    return acc;

  },{});

  let coins = await getCoins();

  coins.forEach(coin => {

    if (accountCoins[coin.code]) {

      accountCoins[coin.code]['name'] = coin.name;
      accountCoins[coin.code]['icon'] = coin.logo_url as string

      accountCoins[coin.code].unavailable = Boolean(coin.unavailable)
      accountCoins[coin.code].supported = Boolean(coin.supported)

    } else {

      accountCoins[coin.code] = {
        code: coin.code,
        name: coin.name,
        currency: coin.currency as string,
        chain: coin.chain as string,
        enabled: false,
        icon: coin.logo_url as string,
        supported: coin.supported as boolean
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

