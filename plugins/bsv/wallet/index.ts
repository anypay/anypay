import * as http from 'superagent';

require('dotenv').config();

import * as uuid from 'uuid';

import { connect } from 'amqplib';

export function getbalance():Promise<number>{

  return new Promise(async (resolve, reject)=>{

    let resp = await http.get(`https://api.whatsonchain.com/v1/bsv/main/address/${process.env.BSV_HOT_WALLET_ADDRESS}/balance`)

    resolve(resp.body.confirmed/100000000)

  })


}

export function getaddress(){
  return process.env.BSV_HOT_WALLET_ADDRESS
}

export async function getHotWalletBalance():Promise<number>{
  return await getbalance();
}

export async function getHotWalletAddress():Promise<string>{
  return await getaddress();
}

export function getCurrencyCode(){
  return "BSV";
}

export function getCurrencyName(){
  return "Bitcoin"
}

export async function getHotWallet():Promise<any>{

  let currency = getCurrencyCode();
  let balance = await getHotWalletBalance();
  let deposit_address = await getHotWalletAddress();
  let name = getCurrencyName();

  return {
    "currency": currency,
    "name": name,
    "balance": balance,
    "deposit_address": deposit_address
  }

}

export function sendtoaddress(address: string, amount: number) {

  return new Promise(async (resolve, reject) => {

    let connection = await connect(process.env.AMQP_URL);

    let channel = await connection.createChannel();
    //remember to close the channel when finished

    let uid = uuid.v4(); 
    let errorUid = uuid.v4(); 

    let message = JSON.stringify({

      address: address,

      amount: amount,

      uid

    })

    let queue = `bsv.sendtoaddress.response.${uid}`;
    let errorQeueue = `bsv.sendtoaddress.error.${uid}`;

    await channel.assertQueue(queue, {

      autoDelete: true,

      durable: false

    });

    await channel.assertQueue(errorQeueue, {

      autoDelete: true,

      durable: false

    });

    channel.consume(queue, async (msg) => {

      await channel.ack(msg);

      // close consumer and delete queue
      await channel.cancel(uid);

      await channel.close();

      resolve(msg.content.toString());

    }, {

      exclusive: true,

      consumerTag: uid

    })

    channel.consume(errorQeueue, async (msg) => {

      await channel.ack(msg);

      // close consumer and delete queue
      await channel.cancel(errorUid);

      await channel.close();

      reject(msg.content.toString());

    }, {

      exclusive: true,

      consumerTag: errorUid

    })

    channel.publish('anypay.vending', 'bsv.sendtoaddress', Buffer.from(message))

  });

}


export function sendtomany(outputs: any[][], opreturn: string[] = [] ){

  return new Promise(async (resolve, reject) => {

    let connection = await connect(process.env.AMQP_URL);

    let channel = await connection.createChannel();
    //remember to close the channel when finished

    let uid = uuid.v4(); 
    let errorUid = uuid.v4(); 

    let message = JSON.stringify({

      outputs: outputs,

      msg: opreturn,

      uid

    })

    let queue = `bsv.sendtomany.response.${uid}`;
    let errorQeueue = `bsv.sendtomany.error.${uid}`;

    await channel.assertQueue(queue, {

      autoDelete: true,

      durable: false

    });

    await channel.assertQueue(errorQeueue, {

      autoDelete: true,

      durable: false

    });

    channel.consume(queue, async (msg) => {

      await channel.ack(msg);

      // close consumer and delete queue
      await channel.cancel(uid);

      await channel.close();

      resolve(msg.content.toString());

    }, {

      exclusive: true,

      consumerTag: uid

    })

    channel.consume(errorQeueue, async (msg) => {

      await channel.ack(msg);

      // close consumer and delete queue
      await channel.cancel(errorUid);

      await channel.close();

      reject(msg.content.toString());

    }, {

      exclusive: true,

      consumerTag: errorUid

    })

    channel.publish('anypay.vending', 'bsv.sendtomany', Buffer.from(message))

  });

}


