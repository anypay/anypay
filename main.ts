
import { config } from 'dotenv';

config();

import { log } from './lib/logger';

import * as database from './lib/database';

import { Server } from './servers/rest_api/server';

import * as actors from './actors';

// Start HTTP/JSON API Server
(async function() {

  await database.sync();

  var server = await Server();

  await server.start();

  log.info(`Server running at ${server.info.uri}`);

})();

// Start Actor System
(async function() {

  await actors.start();

})();

