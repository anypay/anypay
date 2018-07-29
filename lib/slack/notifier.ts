const log = require("winston");
const http = require("superagent");

const SLACK_URL = 'https://hooks.slack.com/services/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'

export function notify(message: string) {

  if (process.env.NODE_ENV != 'test') {

  http
    .post(SLACK_URL)
    .send({
      text: message
    })
    .end((error, response) => {
      if (error) {
        log.error("slack:error", error.message);
      } else {
        log.info("slack:notified", response.body);
      }
    });
  }
}
