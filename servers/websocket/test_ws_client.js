
import { models } from '../../lib';

const WebSocket = require('ws');

//const ws = new WebSocket('ws://3.83.15.78:3112');

(async () => {

  let account = await models.Account.findOne({ where: {

    email: 'steven@anypayinc.com'

  }});

  let token = await models.AccessToken.findOne({ where: {

    account_id: account.id

  }});

  const ws = new WebSocket('ws://zyler.local:3000', {
    headers: {
      'x-access-token': token.uid
    }
  });

  ws.on('message', function incoming(data) {
    console.log('message', data);
  });

})();
