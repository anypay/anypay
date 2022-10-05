import { server, expect, spy, auth, newAccountWithInvoice } from '../../utils'

import { log } from '../../../lib/log'
import { config } from '../../../lib/config'

describe("Webhooks Default Endpoint", async () => {

  it('should log the webhook data', async () => {

    spy.on(log, ['info'])

    let [account, invoice] = await newAccountWithInvoice()

    log.info('test.account.created', account)

    const rocketchat_webhook_url = config.get('rocketchat_webhook_url')

    config.set('rocketchat_webhook_url', config.get('DEFAULT_WEBHOOK_URL'))

    var response = await server.inject({
      method: 'POST',
      url: `/v1/api/test/webhooks`,
      payload: invoice.toJSON()
    })

    expect(response.statusCode).to.be.equal(200);

    expect(log.info).to.have.been.called.with('webhooks.test.received')
    
    config.set('rocketchat_webhook_url', rocketchat_webhook_url)
  })

  it('should attempt a webhook for an invoice', async () => {

    let [account, invoice] = await newAccountWithInvoice()

    log.info('test.account.created', account)

    var response = await auth(account)({
      method: 'POST',
      url: `/v1/api/webhooks/${invoice.uid}/attempts`
    })

    expect(response.statusCode).to.be.equal(201);

  })

  it('should list webhoks', async () => {

    let [account] = await newAccountWithInvoice()

    log.info('test.account.created', account)

    var response = await auth(account)({
      method: 'GET',
      url: `/v1/api/webhooks`
    })

    expect(response.statusCode).to.be.equal(200);

    expect(response.result.webhooks).to.be.an('array');

  })


})