
import * as http from 'superagent';

export async function sendWebhook(url, callback) {

  let resp = await http
    .post(url)
    .send(callback);

  return resp;

}

