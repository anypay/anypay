
import { PrivateKey } from 'bsv';
import { hostname } from 'os';
import * as delay from 'delay';

import * as Hapi from 'hapi';
import * as uuid from 'uuid';

import { parse as parseQueryString } from 'querystring';
import { parse as parseURL } from 'url';
import {  accountSubscriptionsSocketIO } from '../../lib/account_subscriptions';

import { models } from '../../../lib';

import { account_subscriptions } from '../../lib/websocket_servers';

import { Actor } from 'rabbi';

interface ServerConnectedEvent {
  server_id: string;
  server_ip?: string;
  server_port?: string;

}

var server_id, queue;

const websockets = {};

import { getChannel, log } from 'rabbi';
require('dotenv').config();

export async function start() {

  const WebSocket = require('ws');

  const server_port = process.env.WEBSOCKET_PORT || 3000;
  const socketio_port = process.env.SOCKETIO_PORT || 3100;

  const websocketServerConfig = {
    port: server_port
  };

  const wss = new WebSocket.Server(websocketServerConfig);

  let privateKey = new PrivateKey();
  log.info('rabbi.websockets.privatekey', privateKey.toWIF());
  let address = privateKey.toAddress().toString();
  log.info('rabbi.websockets.address', address);

  server_id = address;

  let channel = await getChannel();

  await channel.publish('rabbi.websockets', 'servers_events', Buffer.from(JSON.stringify({
    event: 'server.started',
    payload: {
      server_id: address,
      server_ip: hostname(),
      server_port
    }
  })));

  log.info('rabbi.websockets.server.started', websocketServerConfig);


  let socketioServer = new Hapi.Server({
    port: socketio_port,
    host: '0.0.0.0'
  });

  const io = require("socket.io")(socketioServer.listener);

  io.on("connection", async (client) => {

    try {

      console.log('socketio.handshake.url', client.handshake.url);
      let urlToken = parseQueryString(parseURL(client.handshake.url).query).token;
      console.log('url.query.token', urlToken);

      client.uid = uuid.v4();

      log.info("socketio.connected", client.uid);

      let token = await models.AccessToken.findOne({ where: {

        uid: urlToken

      }});

      if (!token) {

        log.error('socketio.authentication.failed', client.handshake.url);

        return client.close();

      }

      accountSubscriptionsSocketIO.subscribeAccount(client, token.account_id);

      log.info("socketio.account.subscribed", client.uid, token.account_id);

      let account = await models.Account.findOne({ where: {
        id: token.account_id
      }});

      let websocket_id = new PrivateKey().toAddress().toString();

      log.info(`socketio.connected ${account.email}`);

      client.websocket_id = websocket_id;
      client.account_id = account.id;
      client.account_email = account.email;

      client.on("disconnect", () => {

        try {

          delete websockets[client.uid];

          accountSubscriptionsSocketIO.unsubscribeClient(client);

          log.info("socketio.disconnected", client.uid);

        } catch(error) {

          console.log(error.message);

        }
      });
    } catch(error) {

      console.log('error', error.message);
    }
  });

  io.on('error', (e) => log.error(e) );

  wss.on('connection', async function connection(ws, req) {

    let urlToken = parseQueryString(parseURL(req.url).query).token;

    console.log('URL TOKEN', urlToken);

    if (!urlToken && !req.headers['x-access-token']) {
      log.info(`x-access-token header must be set with valid access token`);
      return ws.close();
    }

    let token = await models.AccessToken.findOne({ where: {
      uid: urlToken || req.headers['x-access-token']
    }});

    if (!token) {
      log.info(`invalid access token ${urlToken || req.headers['x-access-token']}`);
      return ws.close();
    }

    console.log('token found!', token.uid);

    let account = await models.Account.findOne({ where: {
      id: token.account_id
    }});

    console.log('account.found', account.id);

    let websocket_id = new PrivateKey().toAddress().toString();

    log.info(`websocket.connected ${account.email}`);

    ws.websocket_id = websocket_id;
    ws.account_id = account.id;
    ws.account_email = account.email;

    try {
      // 1) subscribe websocket client to account events
      account_subscriptions.subscribeAccount(ws, account.id);

      // 2) publish client connected to websockets supervisor
      await channel.publish('rabbi.websockets', 'servers_events', Buffer.from(JSON.stringify({
        event: 'websocket.connected',
        payload: {
          server_id: address,
          websocket_id,
          account_id: account.id,
          account_email: account.email,
          client_ip: req.connection.remoteAddress
        }
      })));
    } catch(error) {

      console.log(error.message);

    }

    ws.on('error', async function(error) {

      console.log('websocket.error', error.message);

      account_subscriptions.unsubscribeClient(ws);

      await channel.publish('rabbi.websockets', 'servers_events', Buffer.from(JSON.stringify({
        event: 'websocket.disconnected',
        payload: {
          server_id: address,
          websocket_id: ws.websocket_id,
          client_ip: hostname()
        }
      })));

    });

    ws.on('close', async function close() {
      try {

        account_subscriptions.unsubscribeClient(ws);

        await channel.publish('rabbi.websockets', 'servers_events', Buffer.from(JSON.stringify({
          event: 'websocket.disconnected',
          payload: {
            server_id: address,
            websocket_id: ws.websocket_id,
            client_ip: hostname()
          }
        })));

      } catch(error) {

        console.log(error.message);

      }

    });

  });

  queue = `account_events_to_websockets.${address}`

  Actor.create({

    exchange: 'anypay.account_events',

    routingkey: 'accounts.*.#',

    queue

  })
  .start(async (channel, msg, json) => {

    console.log(msg.content.toString());

    let routingKeys = msg.fields.routingKey.split('.');

    let id = routingKeys[1];
    let event = routingKeys.slice(2, routingKeys.length).join('.');

    console.log(event, json);

    let account = await models.Account.findOne({ where: { id }});

    if (!account) { return channel.ack(msg) }

    try {

      account_subscriptions.handleAccountEvent(id, event, json);
      accountSubscriptionsSocketIO.handleAccountEvent(id, event, json);

    } catch(error) {

      console.log(error.message);

    }

    await channel.ack(msg);

  });

  socketioServer.start();
  log.info(`rabbi.socketio.server.started ${socketioServer.info.uri}`);


}

process.on('SIGINT', async function() {

  log.info('rabbi.signals.SIGINT');

  let channel = await getChannel();

  await channel.publish('rabbi.websockets', 'servers_events', Buffer.from(JSON.stringify({
    event: 'server.stopped',
    payload: {
      server_id
    }
  })));

  await channel.deleteQueue(queue);

  await delay(1000);

  process.exit(1);

});

if (require.main === module) {

  start();

}

