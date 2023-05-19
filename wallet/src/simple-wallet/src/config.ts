
require('dotenv').config()

var config = require('nconf');

config.argv()
   .env()

config.defaults({
  'domain': 'api.anypayx.com',
  'api_base': 'https://api.anypayx.com'
})

export default config 

