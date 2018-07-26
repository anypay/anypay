
import * as http from 'superagent';

async function notifySlack(event: string, message: string) {

  await http
    .post('https://hooks.slack.com/services/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')
    .send({
      text: `${event} ${message}`
    });
}

export {notifySlack}
