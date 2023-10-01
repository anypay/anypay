import { log } from './log';

const http = require("superagent");

const base = 'https://chat.anypayinc.com/hooks';

const channels: {
  [key: string]: string
} = {
  'misc': 'nbfWhcsDeXypz4RDu/AXqEGLCQbno7gotBTuipAwsZzuTTMtPZ3LHfRx86u3dHf6aY'
}

export function notify(channel: string, message: string) {

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
    .end((error: Error, response: { body: any; }) => {
      if (error) {
        log.error("rocketchat.error", error);
      } else {
        log.info("rocketchat.notified", response.body);
      }
    });
}
