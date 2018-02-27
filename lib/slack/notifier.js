const log = require("winston");
const http = require("superagent");

const SLACK_URL = process.env.ANYPAY_SLACK_HOOKS_URL;
const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

module.exports.notify = function(message) {

  if (SLACK_URL && IS_PRODUCTION) {
    log.info('posting slack message', message);

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
  } else {

    log.info('not posting slack message, ANYPAY_SLACK_HOOKS_URL must be set');
  }
}
