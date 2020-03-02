/* implements rabbi actor protocol */

require('dotenv').config();

import * as io from 'socket.io-client';

import { log } from 'rabbi';

export async function start() {

  const socket = io(process.env.SOCKET_IO_URL || 'http://localhost');

  socket.on('connect', function(){
    log.info('socket.connected'); 

    socket.emit('subscribe');

    log.info('socket.subscribed');
  });

  socket.on('invoice.created', function(data){
    log.info('invoice.created', data); 
  });

  socket.on('invoice.paid', function(data){
    log.info('invoice.paid', data); 
  });

  socket.on('disconnect', function(){
    log.info('socket.disconnected'); 
  });

}

if (require.main === module) {

  start();

}

