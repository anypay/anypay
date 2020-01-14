import * as bchWallet from '../../../plugins/bch/wallet';
import * as btcWallet from '../../../plugins/btc/wallet';

export async function getHotWallets(){

  let btc = await btcWallet.getHotWallet();

  let bch = await bchWallet.getHotWallet();

  let wallets = [btc, bch]

  return {wallets}

}

