
import { rpc } from './dashd_rpc';
import {publishSlackMessage} from './slack_notifier';

import * as http from 'superagent';

export async function notifyDashBackBalance() {

  let balance = (await rpc.getBalanceAsync("", 0)).result;

  console.log(`dashback hot wallet balance is ${balance}`);

  let text = `dashback hot wallet balance is ${balance}`;

  await sendMessage(text);

}

export async function sendMessage(text: string) {
  
  let baseURL = 'https://api.telegram.org/bot637797370:AAEbEK-_nJfprn3Ghqcif8XxvPRaGPorTpE/sendMessage';

  await http
    .post(baseURL)
    .send({
      chat_id: '-208849349',
      text: text
    })

  console.log('message published to telegram');

}
