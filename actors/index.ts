
/* Actor System
 *
 * All actors in the main process are required and started here.
 *
 * Actors are defined as long running routines that accept messages
 * as input, send out messages as output, and export a single function
 * `start`. They can also be executed directly
 *
 */

import * as slack from './slack/actor';
import * as webhooks from './webhooks/actor';

require('./payment_publisher')
require('../lib/email/index')

let actorModules = {
  slack,
  webhooks
}

import { log } from '../lib';

async function start(actors?: any) {

  log.info('starting actor system');

  if (Array.isArray(actors)) {

    log.info(`actors specified ${JSON.stringify(actors)}`);

  }

  if (typeof actors === 'string') {

    log.info(`start single actor "${actors}"`);

    actors.split(",").forEach(actor => {

      if (actorModules[actor]) {

        actorModules[actor].start();

      } else {

        throw new Error(`actor ${actor} not found`);

      }

    });

  }

  if (actors === true || typeof actors === 'undefined') {

    log.info('start all actors');

    await slack.start();
    await webhooks.start();
  }

}

export {
  start
};

if (require.main === module) {

  start();

}

