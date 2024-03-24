const Sequelize = require("sequelize");

import { join } from 'path'

import { readFileSync } from 'fs'
import { config } from './config';

const rdsCa = readFileSync(join(__dirname, '../config/rds/us-east-1-bundle.pem'))

var database: any

if (config.get('NODE_ENV') === 'production') {

  database = new Sequelize(config.get('DATABASE_URL'), {
    logging: false,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: [rdsCa]
      }
    }
  });

} else {

  database = new Sequelize(config.get('DATABASE_URL'), {
    logging: false,
    dialect: "postgres"
  });
}

module.exports = database

export async function query(statement: string) {
  return database.query(statement)
}

const sequelize = database

export { sequelize }

