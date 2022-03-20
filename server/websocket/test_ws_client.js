
import { models } from '../../lib';

const WebSocket = require('ws');

(async () => {

  let account = await models.Account.findOne({ where: {

    email: 'steven@anypayinc.com'

  }});

  let token = await models.AccessToken.findOne({ where: {

    account_id: account.id

  }});

  const ws = new WebSocket('wss://ws.anypayinc.com', {
    headers: {
      'x-access-token': token.uid
    }
  });

  ws.on('open', function() {

    log.info('websocket.test.client.connected');

  });

  ws.on('message', function incoming(data) {

    log.info('websocket.test.client.message', data);
  });

  ws.on('error', function incoming(data) {

    log.info('websocket.test.client.error', data);

  });

})();

