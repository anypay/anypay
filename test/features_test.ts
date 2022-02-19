
import { expect } from './utils'

import { features } from '../lib'

describe("Features Test", () => {

  it("bip70 should not be enabled by default", () => {

    expect(features.isEnabled('protocols.bip70')).to.be.equal(false)

  })

  it("bip270 should be enabled by default", () => {

    expect(features.isEnabled('protocols.bip270')).to.be.equal(true)

  })

  it("should throw an error if feature is not found at all", () => {

    expect(() => {

      features.isEnabled('notafeature')

    }).to.throw()

  })

  it("should allow overriding features by environment", () => {

    process.env['FEATURES_PROTOCOLS_BIP70'] = '1'

    expect(features.isEnabled('protocols.bip70')).to.be.equal(true)

    process.env['FEATURES_PROTOCOLS_BIP70'] = '0'

    expect(features.isEnabled('protocols.bip70')).to.be.equal(false)

    process.env['FEATURES_PROTOCOLS_BIP70'] = 'true'

    expect(features.isEnabled('protocols.bip70')).to.be.equal(true)

    process.env['FEATURES_PROTOCOLS_BIP70'] = 'false'

    expect(features.isEnabled('protocols.bip70')).to.be.equal(false)

  })

})

