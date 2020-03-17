const http = require("superagent");

const SLACK_URL = 'https://chat.anypay.global/hooks/2i7vS3RH3TZKgZvGN/B4Z64ZN24JMDftCfQDsijwsB22wJPWkx54obELv8HEHcGfRe'

export function notify(message: string) {

  http
    .post(SLACK_URL)
    .send({
      text: message
    })
    .end((error, response) => {
      if (error) {
        console.log("rocketchat:error", error.message);
      } else {
        console.log("rocketchat:notified", response.body);
      }
    });

}
