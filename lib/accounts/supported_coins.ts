import {Account, Address} from '../models';

function CoinsFromAccount(account) {
  var coins = {

    'DASH': {
      code: 'DASH',
      name: 'dash',
      enabled: false,
      icon: 'https://pos.anypay.global/dash.png',
      address: account.dash_payout_address
    },
    'BCH': {
      code: 'BCH',
      name: 'bitcoin cash',
      enabled: false,
      icon: 'https://pos.anypay.global/bch.png',
      address: account.bitcoin_cash_address
    },
    'BTC': {
      code: 'BTC',
      name: 'bitcoin',
      enabled: false,
      icon: 'https://pos.anypay.global/btc.png',
      address: account.bitcoin_payout_address
    },
    'LTC': {
      code: 'LTC',
      name: 'litecoin',
      enabled: false,
      icon: 'https://pos.anypay.global/ltc.png',
      address: account.litecoin_address
    },
    'XRP': {
      code: 'XRP',
      name: 'ripple',
      enabled: false,
      icon: 'https://pos.anypay.global/xrp.png',
      address: account.ripple_address
    },
    'DOGE': {
      code: 'DOGE',
      name: 'dogecoin',
      enabled: false,
      icon: 'https://pos.anypay.global/doge.png',
      address: account.dogecoin_address
    },
    'ZEC': {
      code: 'ZEC',
      name: 'zcash',
      enabled: false,
      icon: 'https://pos.anypay.global/zec.png',
      address: account.zcash_address
    },
    'BTC.lightning': {
      code: 'BTC',
      name: 'BTC Lightning',
      enabled: false
    }
  };

  if (account.bitcoin_payout_address) {
    coins['BTC'].enabled = true;
  }

  if (account.dash_payout_address) {
    coins['DASH'].enabled = true;
  }

  if (account.bitcoin_cash_address) {
    coins['BCH'].enabled = true;
  }

  if (account.litecoin_address) {
    coins['LTC'].enabled = true;
  }

  if (account.ripple_address) {
    coins['XRP'].enabled = true;
  }

  if (account.zcash_t_address) {
    coins['ZEC'].enabled = true;
  }

  if (account.dogecoin_address && account.dogecoin_enabled) {
    coins['DOGE'].enabled = true;
  }

  if (account.lightning_uri) {
    coins['BTC.lightning'].enabled = true;
  }

  return coins;
}

export async function getSupportedCoins(accountId: number): Promise<any> {

  let account = await Account.find({ where: { id: accountId }})

  let accountCoins = CoinsFromAccount(account);

  let addresses = await Address.findAll({

    where: { account_id: accountId  }

  });

  addresses.forEach(address => {

    accountCoins[address.currency] = {
      code: address.currency,
      name: address.currency,
      enabled: true,
      icon: `https://pos.anypay.global/${address.currency.toLowerCase()}.png`,
      address: address.value
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

