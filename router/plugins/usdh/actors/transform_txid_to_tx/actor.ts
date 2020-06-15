/* implements rabbi actor protocol */

const BITBOXSDK = require('bitbox-sdk')
const slpjs = require('slpjs');


const BITBOX = new BITBOXSDK.BITBOX({ restURL: 'https://rest.bitcoin.com/v2/' });

const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX);

require('dotenv').config();

const txs = {}

var CACHE_EXPIRY_MILLISECONDS = 1000;

import { Actor, Joi } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'bch.anypay.global',

    routingkey: 'walletnotify',

    queue: 'transform.txid.to.tx.usdh'

  })
  .start(async (channel, msg) => {

    try{

      let txid = msg.content.toString();

      if(!(await getTx(txid))){

        let tx = await bitboxNetwork.getTransactionDetails( msg.content.toString());

        console.log(tx);

        await setTx(txid);

        channel.publish('anypay.router', 'transaction.usdh', Buffer.from(JSON.stringify(tx)))

      }
      
    }catch(e){

      console.log(e)


    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

async function getTx(txid): Promise<boolean> {
	if (txs[txid]) {
		return true
	} else {
		return false
	}

}

async function setTx(txid): Promise<number> {
	txs[txid] = true

	// expire cache after a set time
	setTimeout(() => {

		delete txs[txid]

	}, CACHE_EXPIRY_MILLISECONDS);

  return CACHE_EXPIRY_MILLISECONDS;
}
