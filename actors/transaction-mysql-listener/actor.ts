/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {log, models, mysql_lib} from '../../lib';

import * as amqp from 'amqplib';

import * as http from 'superagent';

const MySQLEvents = require('@rodrigogs/mysql-events');

const mysql = require('mysql');

const dsn = {
  host:     process.env.MYSQL_HOST,
  user:     process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
};


export async function start() {

  const connection = mysql.createConnection(dsn);

  const conn = await amqp.connect(process.env.AMQP_URL)

  const chan = await conn.createChannel();

  const instance = new MySQLEvents(connection, {
    startAtEnd: true 
  });

  await instance.start();

  instance.addTrigger({
    name: 'monitoring all statments',
    expression: 'batm.*', 
    statement: MySQLEvents.STATEMENTS.ALL, 
    onEvent: async e => {
      await chan.publish('anypay.mysql', 'events', Buffer.from( JSON.stringify(e)))
    }
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

  Actor.create({

    exchange: 'anypay.mysql',

    routingkey: 'events',

    queue: 'listener.transactions',

  })  
  .start(async (channel, msg) => {

    let event =  JSON.parse(msg.content) 

    if( event.table === 'transactionrecord' ){

      log.info('mysql event:', event)

      await mysql_lib.writeTransactionRecord(event)

    }

    channel.ack(msg);

  }); 

}

if (require.main === module) {

  start();

}

