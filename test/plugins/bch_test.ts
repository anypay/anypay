
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe("BCH", () => {

  it('should find the plugin for BCH', async () => {

    let plugin = await find({ chain: 'BCH', currency: 'BCH' })

    expect(plugin.currency).to.be.equal('BCH')

    expect(plugin.chain).to.be.equal('BCH')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'BCH', currency: 'BCH' });

    let txid = '4e51acd9be7d61955838cf4ec20a294465d612f485c6615c5777b7b52320ba4f'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('000000000000000002a18e30eb35e7c9d12a5daa9d5ebe840d39e39ca4ac29ce')

    expect(height).to.be.equal(792678)

    expect(timestamp).to.be.a('date')

  })

})

