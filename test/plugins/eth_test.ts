

import { find } from '../../lib/plugins'

import { Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('ETH', () => {

  it('should find the plugin for ETH', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'ETH' })

    expect(plugin.currency).to.be.equal('ETH')

    expect(plugin.chain).to.be.equal('ETH')

    expect(plugin.decimals).to.be.equal(18)

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'ETH' });

    let txid = '0xcd43123eea81e3b9e2227d6468f6f6ad174e90e6f793b2302c7b03f04604381b'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('0x5b192061e9a046cb05f7f72f5d71bcca2d53cc7083d3a738163f7e155ec6fa05')

    expect(height).to.be.equal(17255716)

    expect(timestamp).to.be.a('date')

  })

  it('#getPayments should accept a txid and return a parsed ETH payment', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'ETH' });

    let txid = '0xf7078f1e8b8c36a7a6ae8acae6bba345f4447aa221817ccaccb5b57b238e8b75'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x63fc765a644d31f87a2284fd4bf728c9d767d921') 

    expect(payment.amount).to.be.equal(0.01527581)

    expect(payment.chain).to.be.equal('ETH') 

    expect(payment.currency).to.be.equal('ETH') 

    expect(payment.txid).to.be.equal(txid)

  })

  it('#parsePayments should accept a raw transaction and return a parsed ETH payment', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'ETH' });

    let txid = '0xf7078f1e8b8c36a7a6ae8acae6bba345f4447aa221817ccaccb5b57b238e8b75'

    let txhex = '0xf86e8303062285046ee870ba8252089463fc765a644d31f87a2284fd4bf728c9d767d92187364544acb4d4008025a004193d0439037192b7c9ee4e81f30ab97292763c27fbc73244c2f7f54672e42ba05ea478ef2154f89aa3acbbd46917b40149dd5a3d3e52aa45f30332dbd8482a3f'

    let payments: Payment[] = await plugin.parsePayments(txhex)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x63fc765a644d31f87a2284fd4bf728c9d767d921') 

    expect(payment.amount).to.be.equal(0.01527581)

    expect(payment.chain).to.be.equal('ETH') 

    expect(payment.currency).to.be.equal('ETH') 

    expect(payment.txid).to.be.equal(txid)

  })

})

