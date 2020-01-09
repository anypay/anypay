/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import * as amqp from 'amqplib';

import * as http from 'superagent';

import {log, models, mysql_lib} from '../../lib';

const mysql = require('mysql');

const dsn = {
  host:     process.env.MYSQL_HOST,
  user:     process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'batm',
  connectionLimit: 100
};

const async = require("async");

( async ()=> {

  let connection = await amqp.connect(process.env.AMQP_URL);
        
  let chan = await connection.createChannel();

  setInterval( async ()=>{

    await chan.publish('anypay.mysql', 'fetch.transactionrecords', Buffer.from('fetch transaction records'))        

  }, 60000 )

})()


export async function start() {

  Actor.create({

    exchange: 'anypay.mysql',

    routingkey: 'fetch.transactionrecords',

    queue: 'write.vending.transactions',

  }) 
  .start(async (channel, msg) => {

     log.info('fetching transaction records');

     let records = await mysql_lib.getLatestTransactionRecords();

     await mysql_lib.writeTransactionRecords(records)

     channel.ack(msg);

  }); 

}

if (require.main === module) {

  start();

}
