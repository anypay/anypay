
var config = require('nconf');

import { join } from 'path'

let file = join(process.cwd(), 'config', 'anypay.json')

config.argv()
   .env()
   .file({ file });

config.defaults({
  'DOMAIN': 'api.anypayx.com',
  'API_BASE': 'api.anypayx.com',
  'AMQP_URL': 'amqp://guest:guest@localhost:5672/',
  'DATABASE_URL': 'postgres://postgres@localhost:5432/anypay',
  'EMAIL_SENDER': 'support@anypayx.com'
})

export { config } 

