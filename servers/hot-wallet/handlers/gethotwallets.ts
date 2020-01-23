import * as bchWallet from '../../../plugins/bch/wallet';
import * as btcWallet from '../../../plugins/btc/wallet';
import * as dashWallet from '../../../plugins/dash/wallet';
import * as Boom from 'boom';

export async function getHotWallets(){

  try{

    let btc = await btcWallet.getHotWallet();

    let bch = await bchWallet.getHotWallet();

    let dash = await dashWallet.getHotWallet();

    let wallets = [btc, bch, dash]

    return {wallets}

  }catch(error){

    console.log(error)
    return Boom.badRequest(error)

  } 

}

