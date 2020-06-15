require('dotenv').config();

import { JsonRPC } from './jsonrpc'; 

import { BigNumber } from 'bignumber.js';

import * as bitcoinCom from './bitcoin_com';

const bitcore: any = require('bitcore-lib-cash');

interface UTxO {
  txid: string;
  vout: number;
  address: string;
  account: string;
  scriptPubKey: string;
  amount: BigNumber;
  confirmations: number;
  spendable: boolean;
  solvable: boolean;
  ps_rounds: number;
}

export class RPCSimpleWallet extends JsonRPC {

  fee: number;

  coin: string;

  address: string;

  balance: number;

  utxos: UTxO[];

  constructor(coin: string, address?: string) {

    super(coin);

    this.coin = coin;;

    if (address) {

      this.address = address;

    }

  }

  async getUtxos() {

    if (this.coin === 'BCH') {

      return bitcoinCom.getUtxos(this.address);

    }

    let utxos = await this.call('listunspent',
        [0, 9999999, [this.address]]);

    return utxos;
  }

  async updateWallet() {

    let utxos = await this.getUtxos();

    this.utxos = utxos.sort((a,b) => a.amount > b.amount);

    this.balance = await this.getAddressUnspentBalance()
  }

  async getNewAddress() {

    let resp = await this.call('getnewaddress');

    this.address = resp;

    return resp;

  }

  async getAddressUnspentBalance() {

    if (!this.utxos) {
      await this.updateWallet();
    }

    return this.utxos.reduce((sum, tx) => {
      return sum.plus(tx.amount);
    }, new BigNumber(0)).toNumber();

  }

  async sendToAddress(address: string, amount: number) {

    if (this.balance < amount) {

      throw new Error(`insufficient balance to send ${amount}`);

    }

    var inputs = [];

    var sumInputs = new BigNumber(0); 

    var fee = new BigNumber(this.fee);

    for (let i=0; i < this.utxos.length; i++) {

      inputs.push(this.utxos[i])

      sumInputs = sumInputs.plus(new BigNumber(this.utxos[i].amount));

      let a = new BigNumber(amount);

      if (sumInputs.isGreaterThanOrEqualTo(a.plus(fee))) {
        break;
      }
      
    }

    let outputs = {};

    let outputAmount = new BigNumber(amount);

    outputs[address] = parseFloat(amount.toFixed(8));

    let changeAmount = sumInputs
      .minus(outputAmount)
      .minus(fee)
      .toNumber();

    if (changeAmount > 0) {

      // must be eight decimals max to be valid
      outputs[this.address] = parseFloat(changeAmount.toFixed(8));

    }

    console.log('OUTPUTS', outputs);

    let params = [
      inputs.map(i => {
        return {
          txid: i.txid,
          vout: i.vout
        }
      }),
      outputs
    ];

    var newRawTx;

    try {

      console.log('create raw tx params', params);

      newRawTx = await this.call('createrawtransaction', params);

      console.log("new raw tx", newRawTx);

    } catch(error) {

      console.error(error);

      throw error;

    }

    var signedtx;

    try {

      //signedtx = (new bitcore.Transaction(newRawTx)).sign(process.env.SLP_FUNDING_SECRET);
      signedtx = await this.call('signrawtransactionwithkey', [newRawTx, [process.env.SLP_FUNDING_SECRET]]);

      console.log('signedtx', signedtx);

    } catch(error) {

      console.error('signrawtransaction.error', error.message);

      throw error;

    }

    if (!signedtx.complete) {

      throw new Error(signedtx.errors[0].error);

    }

    var newtx;

    try {

      newtx = await this.call('sendrawtransaction', [signedtx.hex]);

    } catch(error) {

      console.error('sendrawtransaction.error', error);

    }

    return newtx;

  }

  async setAddress(address: string) {

    this.address = address;
  }

}

