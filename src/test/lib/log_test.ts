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

import { expect, spy } from '@/test/utils'
import { Logger, log } from '@/lib/log'
import * as amqp from '@/lib/amqp'

describe("lib/log.ts", () => {

  it('should be constructed with option to override environment', async () => {

    const logger = new Logger({ env: 'development' })

    logger.info('test.log.info', {})

    logger.debug('test.log.debug', {})

    logger.error('test.log.debug', new Error())

  })

  it('should log info', () => {

    log.info('test.log.info', {})

  })

  it('should re-publish message to account amqp topic when account_id is provided', async () => {

    const logger = new Logger({ env: 'development' })

    spy.on(amqp, ['publish'])

    logger.info('test.log.info', {
      account_id: 52
    })

    expect(amqp.publish).to.have.been.called

  })

  it('should re-publish message to invoice amqp topic when account_id is provided', async () => {
    
    const logger = new Logger({ env: 'development' })

    spy.on(amqp, ['publish'])

    logger.info('test.log.info', {
      invoice_uid: 'ghdielkske'
    })

    expect(amqp.publish).to.have.been.called

  })

  it('should log debug', () => {

    log.debug('test.log.debug', {})

  })

  it('should log error', () => {

    log.error('test.log.error', new Error())

  })

  it('#read should read messages from the log', async () => {

    const results = await log.read({
      type: 'test.log.info'
    })

    expect(results).to.be.an('array')

  })

  it('should log a payload object that has a toJSON function', async () => {

    const object = { toJSON: () => {}}

    spy.on(object, ['toJSON'])

    log.info('to.json', object)

    expect(object.toJSON).to.have.been.called
    
  })

})
