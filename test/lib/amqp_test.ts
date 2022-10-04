
import { expect, account } from '../utils'

import { publishEvent } from '../../lib/amqp'

describe('lib/amqp', () => {

  it('the default test account should be a Account', async () => {

    expect(account).to.be.not.equal(null)

    expect(account.email).to.be.a('string')

    expect(account.denomination).to.be.a('string')

  })

  it("#publishEvent should allow publishing of topic and payload", async () => {

    await publishEvent('payment.confirmed', { invoic_uid: 12345 })
    
  })

})
 