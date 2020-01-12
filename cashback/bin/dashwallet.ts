require('dotenv').config();

import { RPCSimpleWallet } from '../lib/rpc-simple-wallet';

let dashWallet = new RPCSimpleWallet('DASH', process.env.DASH_SOURCE_ADDRESS);

dashWallet.updateWallet().then(res => {

  console.log('dashwallet.updated', res);

})
.catch(err => {

  console.error('dashwallet.error', err);

});
