/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { server, expect, spy, newAccountWithInvoice, jwt } from '../../utils'

import { log } from '../../../lib/log'
import { config } from '../../../lib/config'

describe("Webhooks Default Endpoint", async () => {

  it('should log the webhook data', async () => {

    spy.on(log, ['info'])

    let [account, invoice] = await newAccountWithInvoice()

    log.info('test.account.created', account)

    const rocketchat_webhook_url = config.get('ROCKETCHAT_WEBHOOK_URL')

    config.set('ROCKETCHAT_WEBHOOK_URL', config.get('DEFAULT_WEBHOOK_URL'))

    var response = await server.inject({
      method: 'POST',
      url: `/v1/api/test/webhooks`,
      payload: invoice
    })

    expect(response.statusCode).to.be.equal(200);

    expect(log.info).to.have.been.called.with('webhooks.test.received')
    
    config.set('ROCKETCHAT_WEBHOOK_URL', rocketchat_webhook_url)
  })

  it('should attempt a webhook for an invoice', async () => {

    let [account, invoice] = await newAccountWithInvoice()

    log.info('test.account.created', account)

    var response = await server.inject({
      method: 'POST',
      url: `/v1/api/webhooks/${invoice.uid}/attempts`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    expect(response.statusCode).to.be.equal(201);

  })

  it('should list webhoks', async () => {

    let [account] = await newAccountWithInvoice()

    log.info('test.account.created', account)

    var response = await server.inject({
      method: 'GET',
      url: `/v1/api/webhooks`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    const result = response.result as any

    expect(response.statusCode).to.be.equal(200);

    expect(result.webhooks).to.be.an('array');

  })


})