
import { WebSocket } from 'ws';

import { config }  from '../../lib'

export default async function main() {

  const ws = new WebSocket(config.get('anypay_websockets_url'), {
    headers: {
      'anypay-access-token': config.get('anypay_access_token')
    }
  });

  ws.on('error', console.error);

  ws.on('open', function open() {
    console.log('websocket.client.connected');
  });

  ws.on('close', function close() {
    console.log('websocket.client.disconnected');
  });

  ws.on('message', function message(data) {

    try {

      const { type, payload } = JSON.parse(data.toString())

      console.log('websocket.client.message.received', { type, payload })

      console.log(type, payload)

    } catch(error) {

      console.error('websocket.client.message.received.error', error)

    }

  });

}

if (require.main === module) {

  main()

}
