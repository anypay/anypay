const Sequelize = require("sequelize");

import { join } from 'path'

import { readFileSync } from 'fs'

const rdsCa = readFileSync(join(__dirname, '../config/rds/us-east-1-bundle.pem'))

if (process.env.NODE_ENV === 'test' && process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://postgres:@127.0.0.1:5432/';
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
      ca: [rdsCa]
    }
  }
});

module.exports = sequelize;
