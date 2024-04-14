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

