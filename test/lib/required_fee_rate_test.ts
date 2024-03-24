
import { config } from '../../lib'
import { getRequiredFeeRate } from '../../lib/pay/required_fee_rate'

import { expect } from '../utils'

describe("Required Fee Rate", () => {

  it("should get the required fee rate from environment variables", async () => {

    const environmentVariable = Number(config.get('REQUIRED_FEE_RATE_DOGE'))

    expect(environmentVariable).to.be.greaterThan(1)

    const requiredFeeRate = await getRequiredFeeRate({ chain: 'DOGE' })

    expect(requiredFeeRate).to.be.equal(environmentVariable)

  })

  it("should default to value of 1 satoshi per byte if no variable set", async () => {

    const environmentVariable = config.get('REQUIRED_FEE_RATE_BSV')

    expect(environmentVariable).to.be.equal(undefined)

    const requiredFeeRate = await getRequiredFeeRate({ chain: 'BSV' })

    expect(requiredFeeRate).to.be.equal(1)

  })

  it.skip("should allow the plugin to determine the required fee rate for a coin", () => {

    //TODO: Load a plugin dynamically into the Anypay Engine with custom getRequiredFeeRate()

    /*
     * import {find} from '../../plugins'
     * const plugin = plugins.find({ 
     *   chain: 'BTC',
     *   currency: 'BTC'
     * })
     *
     * let requiredFeeRate = await plugin.getRequiredFeeRate()
     *
     * expect(requiredFeeRate).to.be.greaterThan(0)
     *
     */

  })

})

