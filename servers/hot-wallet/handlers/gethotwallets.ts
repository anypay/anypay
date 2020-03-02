import * as bchWallet from '../../../plugins/bch/wallet';
import * as btcWallet from '../../../plugins/btc/wallet';	
import * as dashWallet from '../../../plugins/dash/wallet';
import * as bsvWallet from '../../../plugins/bsv/wallet';
import * as Boom from 'boom';


export async function getHotWallets(){

  try{

    let btc = await btcWallet.getHotWallet()

    let bch = await bchWallet.getHotWallet()

    let dash = await dashWallet.getHotWallet();

    let bsv = await bsvWallet.getHotWallet();

    let wallets = [btc, bch, dash, bsv]	   

    return {wallets}    

  }catch(error){

    return Boom.badRequest(error)

  } 

}
