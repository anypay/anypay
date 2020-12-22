
process.env.NODE_ENV = 'test'

import { initServer } from './utils'

before(async () => {

  await initServer()

})
