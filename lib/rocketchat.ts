import { log } from './logger';

const http = require("superagent");

const base = 'https://chat.anypayinc.com/hooks';

const channels = {
  'ambassadors': 'EZq3CAaXRwaj9NFun/MipnMqrSBu3aH9EydjazKqC3uqnjZd59xggKmy2itdsBtx94',
  'misc': 'nbfWhcsDeXypz4RDu/AXqEGLCQbno7gotBTuipAwsZzuTTMtPZ3LHfRx86u3dHf6aY'
}

export function notify(channel, message: string) {

  if (!channels[channel]) {
    log.info(`rocketchat channel ${channel} not found`);
    channel = 'misc';
  }

  log.info(`notify slack ${message}`);

  http
    .post(`${base}/${channels[channel]}`)
    .send({
      text: message
    })
    .end((error, response) => {
      if (error) {
        log.error("rocketchat.error", error.message);
      } else {
        log.info("rocketchat.notified", response.body);
      }
    });
}
