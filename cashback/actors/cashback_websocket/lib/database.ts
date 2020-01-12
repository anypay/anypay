
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

export  { pg }

