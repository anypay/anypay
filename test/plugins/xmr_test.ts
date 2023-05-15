
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe('XMR', () => {

  it('should find the plugin for XMR', async () => {

    let plugin = await find({ chain: 'XMR', currency: 'XMR' });

    expect(plugin.currency).to.be.equal('XMR')

    expect(plugin.chain).to.be.equal('XMR')

    expect(plugin.decimals).to.be.equal(12)

  });

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'XMR', currency: 'XMR' });

    let txid = '58f8df857270cfc783c7dfb5e58c69e8dee5b9113242b52cefc62b4296fbcec3'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('cc3d8eace4332c99e13aa915c1f7521490c3f91054cfc7500fce6ec58f66c98a')

    expect(height).to.be.equal(2885963)

    expect(timestamp).to.be.a('date')

  })

})

