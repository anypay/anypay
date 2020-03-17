/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.router',

    routingkey: 'transaction.gold',

    queue: 'publish.gold.payment',

  })
  .start(async (channel, msg) => {

    let tx  = JSON.parse(msg.content.toString())

    let output = tx.vout.filter((out) => {
                
      if(out.scriptPubKey.slpAddrs){
        return true;
      }
      return false
    })
    
    if( tx.tokenInfo.tokenIdHex != '8e635bcd1b97ad565b2fdf6b642e760762a386fe4df9e4961f2c13629221914f' || tx.tokenInfo.transactionType != 'SEND'){
      channel.ack(msg);
      return;
    }

    console.log(tx)
    console.log(tx.tokenInfo.sendOutputs)

    output.forEach((out, index)=>{

      index = index+1
      let payment = {

        currency : 'GOLD',
        address : out.scriptPubKey.slpAddrs[0],
        amount : tx.tokenInfo.sendOutputs[index]/1000,
        hash : tx.txid

      }

      console.log('payment', payment)

      channel.publish('anypay.payments', 'payment', Buffer.from(JSON.stringify(payment)))
      channel.publish('anypay.payments', 'payment.gold', Buffer.from(JSON.stringify(payment)))
      channel.publish('anypay.payments', `payment.gold.${payment.address}`, Buffer.from(JSON.stringify(payment)))

    })
            
    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}


