
require('dotenv').config()

import { log } from '../lib/logger/log'

import { port } from './server'

import { v4 } from 'uuid'

import { EventEmitter } from 'events'

import * as WebSocket  from 'ws'

import { ensureAccessToken } from '../lib/access_tokens'

import { findAccount } from '../lib/account'

const ReconnectingWebSocket = require('reconnecting-websocket');

//const host = 'ws://localhost:8002'
const host = 'ws://localhost:8090'

type Json = any;

class Socket extends EventEmitter {

  sessionId: string;

  token: string;

  rws: typeof ReconnectingWebSocket;

  ws: WebSocket;

  constructor({ token }: { token: string }) {

    super()

    this.token = token;

    this.sessionId = v4()

    this.rws = new ReconnectingWebSocket(host, [], {
      WebSocket
    });
    /*

    this.ws = new WebSocket(host)

    this.ws.on('open', () => {

      this.send('authorization', {

        token: this.token,

        sessionId: this.sessionId

      })

      this.on('message', (data) => {
        console.log("WS DATA", data)

      })

    })
    */

    this.rws.addEventListener('open', async () => {

      this.send('authorization', {

        token: this.token,

        sessionId: this.sessionId

      })

    });

    this.rws.addEventListener('close', () => {

      log.info('ws.client.close')

    });

    this.rws.addEventListener('message', (message) => {

      console.log("RWS MESSAGE", message)

      const { data } = message

      console.log('DATA', data)

      log.info('ws.client.message.raw', data)

      try {

        const json = JSON.parse(data)

        const { type, payload } = json

        log.info('ws.client.message.json', json)

        log.info(`ws.event.${type}`, payload)

        this.emit(type, payload)

      } catch(error) {

        const { message, name } = error

        log.error('ws.client.message.error', {
          error: { message, name }
        })

      }

    });

  }

  send(type: string, payload: Json) {
    const message = JSON.stringify({ type, payload })

    this.ws.send(message)
  }

};

(async () => {

  let account = await findAccount(1177)

  let { jwt } = await ensureAccessToken(account)

  const socket = new Socket({ token: jwt })

  socket.on('authenticated', data => {

    console.log('AUTHENTICATED!', data)

  })

  socket.on('arbitrary.event', data => {

    console.log('ARBITRARY EVENT', data)

  })

})()
