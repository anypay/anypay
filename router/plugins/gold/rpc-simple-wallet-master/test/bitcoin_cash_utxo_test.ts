require('dotenv').config();

import { RPCSimpleWallet } from '../lib/rpc_simple_wallet';

describe("Getting UTXOs from Bitcoin.com", () => {

  it("should get BCH utxos correctly", async () => {

    let address = 'bitcoincash:qp9jz20u2amv4cp5wm02zt7u00lujpdtgy48zsmlvp';

    let wallet = new RPCSimpleWallet('BCH', address);

    let utxos = await wallet.getUtxos();

    console.log(utxos);

  });


});

