
import { server, expect, spy } from '../../utils'

import * as utils from '../../utils'

import { log } from '../../../lib/log'

describe("Webhooks Default Endpoint", async () => {

  it('should log the webhook data', async () => {

    spy.on(log, ['info'])

    let [account, invoice] = await utils.newAccountWithInvoice()

    var response = await server.inject({
      method: 'POST',
      url: `/v1/api/test/webhooks`,
      payload: invoice.toJSON()
    })

    expect(response.statusCode).to.be.equal(200);

    expect(log.info).to.have.been.called.with('webhooks.test.received')

  })

})

