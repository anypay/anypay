import * as bch from 'bitcore-lib-cash';
import { lookupOutputFromInput } from '../../../lib/router_client'
import {rpcCall} from './jsonrpc';
import {RPCSimpleWallet} from '../rpc-simple-wallet-master'

const BITBOXSDK = require('bitbox-sdk');
const BigNumber = require('bignumber.js');
const slpjs = require('slpjs');


interface Payment{
  amount: number;
  hash: string;
  currency: string;
  address: string;
}

interface Route{
  input: {
    currency: string;
    address: string;
  };
  output: {
   currency: string;
   address: string;
  };
  HDKeyAddress: {
    address: string;
    currency: string;
    id: number;
  };
}


export async function getAddressRouteFromTx(tx):Promise<Route>{

  let outputs = tx.vout.filter((out, index) => {
                
    //Ignore outputs with 0 tokens send
    if(out.scriptPubKey.slpAddrs && tx.tokenInfo.sendOutputs[index]/1000 > 0){
      return true;
    }

    return false

  })
  
  var route;

  var value;

  for (let i=0; i < outputs.length; i++) {

    let address = outputs[i].scriptPubKey.slpAddrs[0];

    try {

      route = await lookupOutputFromInput('GOLD', address)

      console.log(`route found for ${address}`)

    } catch(error) {

      console.log(`error no address found for ${address}`);

    }

      if (route) {
       
        return route;

      }

    }

    if (!route) {

      throw(`No Address route found for tx ${tx.hash}`) 

    }

   return null;

}

function satoshisToBCH(sats: number): number{
  return sats/100000000
}
function bchToSatoshis(bch): number{
  return bch*100000000 | 0;
}

export function derivePrivateKey(pk: bch.HDPrivateKey ,nonce): string{
  return  pk.deriveChild(nonce).privateKey.toWIF()
}

export async function sendSLPToken(tokenId, route, pk){

  await sleep(1000);

  const BITBOX = new BITBOXSDK.BITBOX({ restURL: 'https://rest.bitcoin.com/v2/' });
  const fundingAddress           = route.input.address     // <-- must be simpleledger format
  const fundingWif               = pk;        // <-- compressed WIF format
  const tokenReceiverAddress     = [ route.output.address ]; // <-- must be simpleledger format
  const bchChangeReceiverAddress = route.input.address     // <-- must be simpleledger format

  const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX);

  const tokenDecimals = 4;
  
  let balances =  await bitboxNetwork.getAllSlpBalancesAndUtxos(fundingAddress);

  let sendAmounts = [ balances.slpTokenBalances[tokenId].toFixed()/ 10**tokenDecimals];

  sendAmounts = sendAmounts.map(a => (new BigNumber(a)).times(10**tokenDecimals));

  let inputUtxos = balances.slpTokenUtxos[tokenId];

  inputUtxos = inputUtxos.concat(balances.nonSlpUtxos);

  inputUtxos.forEach(txo => txo.wif = fundingWif);

  let sendTxid = await bitboxNetwork.simpleTokenSend(
        tokenId, 
        sendAmounts, 
        inputUtxos, 
        tokenReceiverAddress, 
        bchChangeReceiverAddress
        )

   console.log("Send SLP Token txid: ", sendTxid);

   return [sendTxid, sendAmounts[0]/ 10**(tokenDecimals-1)]
}

export async function sendBCH(address, amount){

  let account = process.env.SLP_FUNDING_ADDRESS;

  let wallet = new RPCSimpleWallet('BCH', account);

  let balance = await wallet.getAddressUnspentBalance();

  await wallet.updateWallet();

  let txid = await wallet.sendToAddress(address, amount);

  console.log('Forward funding tx: ', txid)

  return txid

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
