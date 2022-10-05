
import { expect, account, server } from '../../utils'

import { access } from '../../../lib'

const { ensureAccessToken } = access

describe("API V0 - CSV", async () => {

  it("GET /csv_reports.csv should return a CSV report", async () => {

    const { uid } = await ensureAccessToken(account)

    let response = await server.inject({
      method: 'GET',
      url: `/csv_reports.csv?token=${uid}&start_date=${Date.now()}&end_date=${Date.now()}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("GET /reports/csv/payments.csv should return a CSV report", async () => {

    const { uid } = await ensureAccessToken(account)

    let response = await server.inject({
      method: 'GET',
      url: `/reports/csv/payments.csv?token=${uid}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("GET /csv_reports.csv should reject unauthorized attempts with no token", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/csv_reports.csv`
    })

    expect(response.statusCode).to.be.equal(400)
    
  })



  it("GET /reports/csv/payments.csv should reject unauthorized attempts with no token", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/reports/csv/payments.csv`
    })

    expect(response.statusCode).to.be.equal(400)
    
  })

})
