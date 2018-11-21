
/* Actor System
 *
 * All actors in the main process are required and started here.
 *
 * Actors are defined as long running routines that accept messages
 * as input, send out messages as output, and export a single function
 * `start`. They can also be executed directly
 *
 */

import * as bchPaymentForwarder from '../plugins/bch/actors/payment_forwarder';
import * as zenPaymentForwarder from '../plugins/zen/actors/payment_forwarder';
require('./payment_publisher')
require('../lib/email/index')

async function start() {

  await bchPaymentForwarder.start();
  await zenPaymentForwarder.start();

}

export {
  start
};

if (require.main === module) {

  start();

}

