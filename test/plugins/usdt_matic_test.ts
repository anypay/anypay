

import { find } from '../../lib/plugins'

import { Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('USDT on MATIC', () => {

  it('should find the plugin for USDT.MATIC', async () => {

    let plugin = await find({ currency: 'USDT', chain: 'MATIC' })

    expect(plugin.currency).to.be.equal('USDT')

    expect(plugin.chain).to.be.equal('MATIC')

    expect(plugin.token).to.be.equal('0xc2132d05d31c914a87c6611c10748aeb04b58e8f')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'USDT' });

    let txid = '0x7fa214be78f449b5c2ce854688a4244bfa6039971edea30f46ee535636fed0a0'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('0x01a9acc2827368254847ff96169257db4c756e08647db003c808e99306382df3')

    expect(height).to.be.equal(42679642)

    expect(timestamp).to.be.a('date')

  })

  it('#getPayments should accept a txid and return a parsed USDT payment', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'USDT' });

    let txid = '0x5782e11dea3d70c638587d5fb23d75d2b2f20aee27a250802d585c854e8a2695'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0xf04386e8cf07c7761c9ee365e392ff275d1ebf55')

    expect(payment.amount).to.be.equal(0.1)

    expect(payment.chain).to.be.equal('MATIC') 

    expect(payment.currency).to.be.equal('USDT') 

    expect(payment.txid).to.be.equal(txid)

  })

  it.skip('#parsePayments should accept a raw transaction and return a parsed USDT payment', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'USDT' });

    let txid = '0x5782e11dea3d70c638587d5fb23d75d2b2f20aee27a250802d585c854e8a2695'

    let txhex = '0xF04386e8CF07c7761c9ee365E392Ff275D1EBf55'

    let payments: Payment[] = await plugin.parsePayments(txhex)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0xf04386e8cf07c7761c9ee365e392ff275d1ebf55') 

    expect(payment.amount).to.be.equal(0.1)

    expect(payment.chain).to.be.equal('MATIC') 

    expect(payment.currency).to.be.equal('USDT') 

    expect(payment.txid).to.be.equal(txid)

  })

})

