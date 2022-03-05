
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
    console.log('connected');
  });

  ws.on('message', function incoming(data) {
    console.log('message', data);
  });

  ws.on('error', function incoming(data) {
    console.log('error', data);
  });

})();
