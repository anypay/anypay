
const { Sequelize } = require('sequelize');
import * as Umzug from 'umzug'

import { join } from 'path'

import * as sequelize from '../../../lib/database'

const umzug = new Umzug({
  migrations: { glob: join(process.cwd(), 'migrations/*.js') },
  context: sequelize.getQueryInterface(),
  storageOptions: {
    sequelize 
  },
  logger: console,
});

export async function up() {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.

  await umzug.up();
}

