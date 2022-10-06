
import { expect, spy } from '../utils'
import { Logger, log } from '../../lib/log'
import * as amqp from '../../lib/amqp'

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
