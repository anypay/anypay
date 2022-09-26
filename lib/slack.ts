const log = require("winston");
const http = require("superagent");

const channels = {
  'invoice-bot': 'https://hooks.slack.com/services/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',
  'events': 'https://hooks.slack.com/services/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'
}

export function notify(message: string, channel: string = 'invoice-bot') {

  log.info(`notify slack ${message}`);

  

  if (process.env.NODE_ENV === 'production') {

    http
      .post(channels[channel])
      .send({
        text: message
      })
      .end((error, response) => {
        if (error) {
          log.error("slack:error", error);
        } else {
          log.info("slack:notified", response.body);
        }
      });
  }
}

const SLACK_URL = 'https://hooks.slack.com/services/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';

export async function publishEventToSlack(message: string) {

  if (process.env.NODE_ENV === 'production') {

    await http
      .post(SLACK_URL)
      .send({
        text: message
      })
  }
}
