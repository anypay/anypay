
import * as APM from 'elastic-apm-node'

const apm = APM.start({
  serviceName: 'anypay',
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
  environment: process.env.NODE_ENV
})

export { apm }

