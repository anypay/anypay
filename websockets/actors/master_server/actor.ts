require('dotenv').config();

import { Actor, log } from 'rabbi';
import { requireHandlersDirectory } from '../../../lib/rabbi_hapi';
import { join } from 'path';

const handlers = requireHandlersDirectory(join(__dirname, 'handlers'));

export async function start() {

  Actor.create({

    exchange:'rabbi.websockets',

    routingkey: 'servers_events',

    queue: 'handle_rabbi_websockets_server_events'

  })
  .start(async (channel, msg, json) => {

    if (!json) {

      log.debug(msg.content.toString());

      return channel.ack(msg);
    }

    log.debug(json);

    switch(json.event) {

    case 'server.started':

      handlers.ServerStarted(channel, msg, json);

      break;

    case 'server.stopped':

      handlers.ServerStopped(channel, msg, json);

      break;

    case 'websocket.connected':

      handlers.WebsocketConnected(channel, msg, json);

      break;

    case 'websocket.disconnected':

      handlers.WebsocketDisconnected(channel, msg, json);

      break;

    default:
      
      console.log('rabbi.websockets.servers_events.event', json);

      break;
      
    }

  });

}

if (require.main === module) {

  start();

}

