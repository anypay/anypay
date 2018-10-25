const http = require("superagent")

const bch = require('bitcoincashjs');

const Address = bch.Address;

const fromString = Address.fromString;

const BitpayFormat = Address.BitpayFormat;

const CashAddrFormat = Address.CashAddrFormat;

require("dotenv").config();

import {Payment} from '../../../types/interfaces';

import * as amqp from 'amqplib';

import { connection, channel } from './amqp';

const routing_key = 'payment';

const exchange = 'anypay.payments';

async function getCashAddress(address:string):Promise<any>{

  return new Promise((resolve, reject) => {

    http

      .get('https://rest.bitcoin.com/v1/util/validateAddress/'+address)

      .timeout({

        response: 5000,  // Wait 5 seconds for the server to start sending,

        deadline: 10000, // but allow 1 minute for the file to finish loading.

       })

      .end((error, resp) => {

         if (error) { return reject(error) }

        resolve(resp.body.address)

       });

    })

}

export function getLegacyAddressFromCashAddress(address:string):string{
  
  try{
  
    let cashaddr = fromString( address, 'livenet', 'pubkeyhash', CashAddrFormat);

      return cashaddr.toString()
    
    }
    catch(err){
     
      return address

    }

}

async function getTransactionDetails(hash:string):Promise<any>{

  return new Promise((resolve, reject) => {
    http

      .get('https://rest.bitcoin.com/v1/transaction/details/'+hash)

      .timeout({

        response: 5000,  // Wait 5 seconds for the server to start sending,

        deadline: 10000, // but allow 1 minute for the file to finish loading.

       })

      .end((error, resp) => {

         if (error) { return reject(error) }

        resolve(resp.body)

       });

    })

}

async function getAddressDetails(address:string):Promise<any>{
 
  return new Promise((resolve,reject) => {

  http
   
      .get('https://rest.bitcoin.com/v1/address/details/'+address)
    
      .timeout({
      
        response: 5000,  // Wait 5 seconds for the server to start sending,
	
	deadline: 10000, // but allow 1 minute for the file to finish loading.
        
       })
       
      .end((error, resp) => {
     
      	 if (error) { return reject(error) }
	
	 resolve(resp.body);
	
       });

    })

}

export async function bitbox_checkAddressForPayments(address:string){

  let payments: Payment[]=[]

  try{

    let details = await getAddressDetails(address);

    for( let i = 0; i<details.transactions.length;i++){

      let tx = await getTransactionDetails(details.transactions[i])

      for( let j=0; j<tx.vout.length;j++){
 
        let p: Payment  = {
 
        hash: details.transactions[i],
 
        amount: tx.vout[j].value,

        address: await getCashAddress(tx.vout[j].scriptPubKey.addresses[0]),
 
        currency: 'BCH'

        }

      channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));
      
      console.log(p)

      payments.push(p)

      }

      return(payments)

    }

  }

  catch(error){
     
    console.log(error)

  }

}

