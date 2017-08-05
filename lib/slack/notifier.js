const log = require("winston");
const http = require("superagent");

const SLACK_URL =
'https://hooks.slack.com/services/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'

module.exports.notify = function(message) {

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
