
import * as Hapi from 'hapi';

import { log, database } from '../../lib';

import { validateSudoPassword } from './auth/sudo_admin_password';

async function Server() {

  var server = new Hapi.Server({
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 8100,
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      }
    }
  });

  await server.register(require('hapi-auth-basic'));
  server.auth.strategy("sudopassword", "basic", { validate: validateSudoPassword});

  return server;

}

async function start() {

  await database.sync()

  var server = await Server();

  // Start the server
  await server.start();

  log.info("Server running at:", server.info.uri);

}

if (require.main === module) {

  start()

}

export {

  start

}

