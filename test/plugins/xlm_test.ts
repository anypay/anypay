
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe("XLM", () => {

  it('should find the plugin for XLM', async () => {

    let plugin = await find({ chain: 'XLM', currency: 'XLM' })

    expect(plugin.currency).to.be.equal('XLM')

    expect(plugin.chain).to.be.equal('XLM')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'XLM', currency: 'XLM' });

    let txid = '8c78e134f26d19b7f52bca7e21ac26c6e02e11bf849c9df513ef929bccfc2334'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('')

    expect(height).to.be.equal(46287271)

    expect(timestamp).to.be.a('date')

  })

})

