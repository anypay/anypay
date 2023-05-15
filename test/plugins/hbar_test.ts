
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe("HBAR", () => {

  it('should find the plugin for HBAR', async () => {

    let plugin = await find({ chain: 'HBAR', currency: 'BSV' })

    expect(plugin.currency).to.be.equal('HBAR')

    expect(plugin.chain).to.be.equal('HBAR')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'HBAR', currency: 'BSV' });

    let txid = ''

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('')

    expect(height).to.be.equal()

    expect(timestamp).to.be.a('date')

  })

})

