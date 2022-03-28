
import { expect, createAccount } from '../utils'

import { log, Logger } from '../../lib/log'

describe("Log", () => {

  it('should instantiate a new logger', () => {

    let logger = new Logger({ namespace: 'test' })

    expect(logger.info).to.be.a('function')

    expect(logger.error).to.be.a('function')

    expect(logger.debug).to.be.a('function')

  })

  it('should log an event', async () => {

    let record = await log.info('my.occurrance', {
      grade: 'A+'
    })

    expect(record.id).to.be.greaterThan(1)

    expect(record.type).to.be.equal('my.occurrance')

    expect(record.payload.grade).to.be.equal('A+')

  })

  it('should log an account event', async () => {

    let account = await createAccount()

    let record = await log.info('account.preference.mailing_address.updated', {
      city: 'Escaldes',
      country: 'Andorra',
      account_id: account.id
    })

    expect(record.id).to.be.greaterThan(1)

    expect(record.payload.city).to.be.equal('Escaldes')

  })

  it('should allow a toJSON() function', async () => {

    let record = await log.info('account.preference.mailing_address.updated', {
      toJSON: () => {
        return {
          city: 'Escaldes',
          country: 'Andorra'
        }
      }
    })

    expect(record.id).to.be.greaterThan(1)

    expect(record.payload.country).to.be.equal('Andorra')

  })

  it('should log an error', async () => {

    let record = await log.error('my.error', new Error('sand in gears'))

    expect(record.id).to.be.greaterThan(1)

    expect(record.type).to.be.equal('my.error')

  })

  it('should read the log of errors', async () => {

    let record = await log.error('my.error', new Error('sand in gears'))

    let entries = await log.read({
      type: 'my.error',
      error: true
    })

    expect(entries.length).to.be.greaterThan(0)

    expect(entries[0].type).to.be.equal('my.error')

    expect(entries[0].error).to.be.equal(true)

  })

})

