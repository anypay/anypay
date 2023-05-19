
import config from '../src/config'

config.set('prometheus_enabled', true)

config.set('prometheus_password', 'letmein')

import { server, start } from '../src/server'

import { expect, authRequest } from './utils'

describe('Scraping Prometheus Metrics', () => {

  before(async () => {

    await start()

  })

  it('GET /metrics should not provide the metrics without a password', async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/metrics'
    })

    expect(response.statusCode).to.be.equal(401)

  })


  it('GET /metrics should provide the metrics with a password', async () => {

    const response = await authRequest(server, 'letmein', {
      method: 'GET',
      url: '/metrics'
    })

    expect(response.statusCode).to.be.equal(200)

  })

})
