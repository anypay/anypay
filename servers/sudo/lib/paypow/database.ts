require('dotenv').config()

const database = require('knex')({
  client: 'pg',
  connection: process.env.PAYPOW_DATABASE_URL,
});

export { database }
