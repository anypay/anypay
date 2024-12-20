
import WebSocket from 'ws';

import { config }  from '@/lib/config'

export default async function main() {

  const ws = new WebSocket(config.get('ANYPAY_WEBSOCKETS_URL'), {
    headers: {
      'anypay-access-token': config.get('ANYPAY_ACCESS_TOKEN')
    }
  });

  ws.on('error', console.error);

  ws.on('open', function open() {

  });

  ws.on('close', function close() {

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
