
import axios from 'axios'
import { log } from './log';

export async function notify(message: string, channel?: string) {

  log.info(`notify slack ${message}`);

  channel = channel || process.env.ANYPAY_SLACK_CHANNEL_URL

  if (!channel) {
    log.error("slack:channel", new Error('ANYPAY_SLACK_CHANNEL_URL environment variable not defined'));
    return;
  }

  await axios.post(channel, {
    text: message
  })


}
