
let database = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

module.exports = database;

