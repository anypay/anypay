
const BigNumber = require('bignumber.js');

import { rpc } from '../../plugins/bsv/lib/jsonrpc';

import {resolveAlias, forwardAllUTXOsToAddress } from '../../plugins/bsv/index';

import {models} from '../index';

export async function getAddressBalance(address: string): Promise<number> {

  let resp = await rpc.call('listunspent', [0, 1000000, [address]]);

  console.log(resp);

  return resp.result.reduce((sum, utxo) => {

    let nAmount = BigNumber(utxo.amount);

    return sum.plus(nAmount);
  
  }, BigNumber(0)).toNumber();

}

export async function claim(account_id: number, alias: string){

  let tipjar = await models.Tipjar.findOne({ where: {

    account_id: account_id,
    currency: 'BSV'

  }});

  let privkey = tipjar.private_key;

  let sendingAddress = tipjar.address;

  let receivingAddress = await resolveAlias(alias) 

  let txid = (await forwardAllUTXOsToAddress(privkey,receivingAddress)).result 

  if(txid){

    tipjar.claim_txid = txid;
    
    tipjar.claim_alias = alias;

    tipjar.claim_address = receivingAddress;

    tipjar.claimed = true;

    try{

      await tipjar.save()
      
    }catch(err){
     
      console.log(err)

    }
  }

  return tipjar.toJSON();

}
