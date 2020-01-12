const log = require("winston");
const http = require("superagent");

const URL = 'https://chat.anypay.global/hooks/wJunCWzTKi4ssMzDw/5iB3dF9XxGpr7KSMw4aHE3eDvhrbQ6WDom5qZdfnWPen9DZM';

export function sendWebhook(message: string) {

  if (process.env.NODE_ENV != 'test') {

  http
    .post(URL)
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
