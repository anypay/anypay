import {Account, Address} from '../models';

function CoinsFromAccount(account) {
  var coins = {

    'DASH': {
      code: 'DASH',
      name: 'dash',
      enabled: false
    },
    'BCH': {
      code: 'BCH',
      name: 'bitcoin cash',
      enabled: false
    },
    'BTC': {
      code: 'BTC',
      name: 'bitcoin',
      enabled: false
    },
    'LTC': {
      code: 'LTC',
      name: 'litecoin',
      enabled: false
    },
    'XRP': {
      code: 'XRP',
      name: 'ripple',
      enabled: false
    },
    'DOGE': {
      code: 'DOGE',
      name: 'dogecoin',
      enabled: false
    },
    'ZEC': {
      code: 'ZEC',
      name: 'zcash',
      enabled: false
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
      enabled: true
    }

  });

  return accountCoins;

}

