let level = require('level');

const dbPath = process.env.DB_PATH ||
  '/var/anypay/oracles/dash-blockcypher-webhook.db';

const db = level(dbPath);

module.exports = db;

