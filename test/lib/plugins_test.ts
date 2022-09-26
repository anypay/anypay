
import { expect } from '../utils'

import plugins from '../../lib/plugins'

describe("Plugins", () => {

  it('should load all the plugins', async () => {

    let plugin = plugins('LTC')

    expect(plugin.currency).to.be.equal('LTC')

    const address = '123455'

    expect(plugin.transformAddress({value: address})).to.be.equal(address)

    expect(plugin.getNewAddress({value: address})).to.be.equal(address)

  })

})
