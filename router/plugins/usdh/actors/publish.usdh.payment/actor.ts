/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.usdh',

    queue: 'publish.usdh.payment',

  })
  .start(async (channel, msg) => {

    let tx  = JSON.parse(msg.content.toString())

    let output = tx.vout.filter((out) => {
                
      if(out.scriptPubKey.slpAddrs){
        return true;
      }
      return false
    })
    
    if( tx.tokenInfo.tokenIdHex != 'c4b0d62156b3fa5c8f3436079b5394f7edc1bef5dc1cd2f9d0c4d46f82cca479' || tx.tokenInfo.transactionType != 'SEND'){
      channel.ack(msg);
      return;
    }

    console.log(tx)
    console.log(tx.tokenInfo.sendOutputs)

    output.forEach((out, index)=>{

      index = index+1
      let payment = {

        currency : 'USDH',
        address : out.scriptPubKey.slpAddrs[0],
        amount : tx.tokenInfo.sendOutputs[index]/100,
        hash : tx.txid

      }

      console.log('payment', payment)

      channel.publish('anypay.payments', 'payment', Buffer.from(JSON.stringify(payment)))
      channel.publish('anypay.payments', 'payment.usdh', Buffer.from(JSON.stringify(payment)))
      channel.publish('anypay.payments', `payment.usdh.${payment.address}`, Buffer.from(JSON.stringify(payment)))

    })
            
    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}


