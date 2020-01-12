
import { rpc } from './dashd_rpc';
import {publishSlackMessage} from './slack_notifier';

export async function notifyDashBackBalance() {

  let balance = (await rpc.getBalanceAsync("", 0)).result;

  console.log(`dashback wallet balance is ${balance}`);

  await publishSlackMessage(`dashback wallet balance is ${balance}`);

}
