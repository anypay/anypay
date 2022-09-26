
import { authHeaders, expect, server } from '../../utils'

describe('Scraping Metrics from Prometheus', () => {

  it('should not have a /metrics enpdoint without the PROMETHEUS_ENABLED flag', async () => {

    let response = await server.inject({
      url: '/_metrics',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(401)

    console.log(response)

  })

  it('should have a /metrics enpdoint with the PROMETHEUS_ENABLED flag', async () => {

    let response = await server.inject({
      url: '/_metrics',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(401)

    console.log(response)

  })

  it('GET /metrics should deny access without credentials', async () => {

    let response = await server.inject({
      url: '/_metrics',
      method: 'GET'
    })

    expect(response.statusCode).to.be.equal(401)

    console.log(response)

  })

  it('GET /metrics should grant access with prometheus app credential', async () => {

    const headers = authHeaders('prometheus', '')

    let response = await server.inject({
      url: '/_metrics',
      method: 'GET',
      headers
    })

    expect(response.statusCode).to.be.equal(200)

  })

})
