
import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe('SOL', () => {

  it('should find the plugin for SOL', async () => {

    let plugin = await find({ chain: 'SOL', currency: 'SOL' })

    expect(plugin.currency).to.be.equal('SOL')

    expect(plugin.chain).to.be.equal('SOL')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'SOL', currency: 'SOL' });

    let txid = 'sva4wpWvkuE2vLeGDHdDdxorYNWVz8p74uyR1i1FnHUudK94hCgh7qKWrRW6hnFaVAFkUQp9AX6jVD5BkuNNFvv'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('6whs717Kr48RW3j2ocsWrW9BiGkSeLFNfnMXN23WAAHL')

    expect(height).to.be.equal(176768846)

    expect(timestamp).to.be.a('date')

  })

  it('#getTransaction should return a transaction from the network in standard format', async () => {

    let plugin = await find({ chain: 'SOL', currency: 'SOL' });
  
    let txid = 'sva4wpWvkuE2vLeGDHdDdxorYNWVz8p74uyR1i1FnHUudK94hCgh7qKWrRW6hnFaVAFkUQp9AX6jVD5BkuNNFvv'

    let transaction = await plugin.getTransaction(txid)

    expect(transaction.txid).to.be.equal(txid)

  })

})

