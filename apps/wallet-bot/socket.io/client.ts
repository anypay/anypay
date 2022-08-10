
import { io } from 'socket.io-client'

import { config } from '../../../lib/config'

import { log } from '../../../lib/log'

    const url = `ws://127.0.0.1:${config.get('PORT')}`

    const connectionOptions = {
      extraHeaders: {
        'authorization': 'Bearer 525252'
      },
      transports: ['websocket']
    }

    log.info('socket.io.client.connect', Object.assign(connectionOptions, { url }))

    const socket = io(url, connectionOptions);

    socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      });
      
      socket.on("disconnect", () => {
        console.log(socket.id); // undefined
      });

      socket.io.on("reconnect_attempt", () => {
        console.log("reconnection_attempt")
      });

      socket.on("connect_error", (error) => {

        console.error('connect_error', error)
 
      });
      
      
      socket.io.on("reconnect", () => {
        console.log("reconnect")
      });

    socket.on('connect', () => {

      console.log('CONNECT');

    })

    socket.on('connected', () => {

      console.log('CONNECTED');

    })

    socket.on('message', message => {
        console.log('message', message)
    })

    socket.on('message.good', message => {
        console.log('message.good', message)
    })

    socket.on('*', ({type, payload}) => {

      console.log(type, payload)

    })

    socket.on('disconnect', () => {
      
      log.info('socket.io.client.disconnect', socket)

    })


    socket.on('close', () => {
      
      log.info('socket.io.client.close', socket)

    })

    socket.on('error', error => {

      log.error('socket.io.client', error)

    })