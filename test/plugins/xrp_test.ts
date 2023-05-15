
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe("XRP", () => {

  it('should find the plugin for XRP', async () => {

    let plugin = await find({ chain: 'XRP', currency: 'XRP' })

    expect(plugin.currency).to.be.equal('XRP')

    expect(plugin.chain).to.be.equal('XRP')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'XRP', currency: 'XRP' });

    let txid = '8F3A872BA256DAEAB6634E6CFE346DD0F02347C28DF37A3B4D26FB6D29CA9C2D'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('13B9FFF7C1A0D5C36DA1442130F2AA3D2537C414CDDB9A2FFEEE918D89CC458D')

    expect(height).to.be.equal(79781368)

    expect(timestamp).to.be.a('date')

  })

})

