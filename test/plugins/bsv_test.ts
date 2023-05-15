
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe("BSV", () => {

  it('should find the plugin for BSV', async () => {

    let plugin = await find({ chain: 'BSV', currency: 'BSV' })

    expect(plugin.currency).to.be.equal('BSV')

    expect(plugin.chain).to.be.equal('BSV')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'BSV', currency: 'BSV' });

    let txid = 'de2b352e1849392a7fce7a8fa2f6295d922307303b007d3804f9589b66624028'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('0000000000000000003a7c1fa88eb6134c0f8b4027e1b1e753079181a462d99a')

    expect(height).to.be.equal(791940)

    expect(timestamp).to.be.a('date')

  })

})

