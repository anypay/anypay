
import { log, events } from '../../../lib';
import { notify } from '../../../lib/slack/notifier';


module.exports.create = async (request, h) => {

  let token = request.auth.credentials.accessToken;

  token.account = request.auth.credentials.account;

  const ip = request.info.remoteAddress

  let event = await events.record({
    event: 'user.login',
    payload: {
      ip,
      token: token.uid
    },
    account_id: token.account.id,
  })

  notify(JSON.stringify(Object.assign(event.toJSON(), {
    email: token.account.email 
  })), 'events');

  return {

    uid: token.uid,

    account_id: token.account_id,

    email: request.auth.credentials.account.email

  };
}

