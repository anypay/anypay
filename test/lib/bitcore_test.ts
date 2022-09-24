
import { expect } from '../utils'

import { getBitcore } from '../../lib/bitcore'

describe('lib/bitcore', () => {

  it('getBitcore should get bitcore for BSV', async () => {

    const bitcore = getBitcore('BSV')

    expect(bitcore).to.be.not.equal(null)

  })

  it('should fail if the plugin does not have bitcore', async () => {

    try {

        getBitcore('XMR')

        throw new Error('exception expected')

    } catch(error) {

        expect(error.message).to.be.equal('bitcore not found for currency')

    }

  })

})
