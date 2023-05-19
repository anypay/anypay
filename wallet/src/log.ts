
import * as winston from 'winston';

import * as Transport from 'winston-transport'

import config from './config'

import { socket } from './socket.io'

import { Socket } from 'socket.io-client'

class WebsocketTransport extends Transport {

  socket: Socket;

  constructor(socket: Socket, opts) {

    super(opts);

    this.socket = socket;

  }

  log(info, callback) {

    try {

      if (this.socket) {

        this.socket.emit('log', info)

      }

    } catch(error) {

      console.log('log.websocket.error', error)
    }

    callback();
  }
};


const transports = [
  new winston.transports.Console({
    format: winston.format.json()
  }),
  new WebsocketTransport(socket, {
    format: winston.format.json()
  })  
]

if (config.get('loki_host')) {

  const LokiTransport = require("winston-loki");

  const lokiConfig = {
    format: winston.format.json(),
    host: config.get('loki_host'),
    json: true,
    batching: false,
    labels: { app: config.get('loki_label_app') }
  }

  if (config.get('loki_basic_auth')) {

    lokiConfig['basicAuth'] = config.get('loki_basic_auth')
  }

  transports.push(
    new LokiTransport(lokiConfig)
  )

}

const log = winston.createLogger({
  level: 'info',
  transports,
  format: winston.format.json()
});

if (config.get('loki_host')) {

  log.debug('loki.enabled')

}

export default log

export { log }

