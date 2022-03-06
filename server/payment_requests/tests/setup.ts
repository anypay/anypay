require('dotenv').config()

process.env.NODE_ENV = 'test'

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
}

import { initServer } from './utils'

before(async () => {

  await initServer()

})
