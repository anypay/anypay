
import * as WebSocket from 'ws';

export default async function main() {

  const ws = new WebSocket('ws://localhost:5201/');

  ws.on('error', console.error);

  ws.on('open', function open() {
    console.log('connected');
  });

  ws.on('close', function close() {
    console.log('disconnected');
  });

  ws.on('message', function message(data) {

    try {

      const { type, payload } = JSON.parse(data.toString())

      console.log('message.received', { type, payload })

      console.log(type, payload)

    } catch(error) {

      console.error('ws.client.error', error)

    }

  });

}

if (require.main === module) {

  main()

}
