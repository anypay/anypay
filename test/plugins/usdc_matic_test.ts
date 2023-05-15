

import { find } from '../../lib/plugins'

import { Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('USDC on MATIC', () => {

  it('should find the plugin for USDC.MATIC', async () => {

    let plugin = await find({ currency: 'USDC', chain: 'MATIC' })

    expect(plugin.currency).to.be.equal('USDC')

    expect(plugin.chain).to.be.equal('MATIC')

    expect(plugin.token).to.be.equal('0x2791bca1f2de4661ed88a30c99a7a9449aa84174')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'USDC' });

    let txid = '0x7fa214be78f449b5c2ce854688a4244bfa6039971edea30f46ee535636fed0a0'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('0x01a9acc2827368254847ff96169257db4c756e08647db003c808e99306382df3')

    expect(height).to.be.equal(42679642)

    expect(timestamp).to.be.a('date')

  })

  it('#getPayments should accept a txid and return a parsed USDC payment', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'USDC' });

    let txid = '0x38a1215e511ba5983fcfb5cb2ec2734777bec4cdfce0081f6d59ba9717eff648'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x4dc29377f2ae10bec4c956296aa5ca7de47692a2') 

    expect(payment.amount).to.be.equal(0.4)

    expect(payment.chain).to.be.equal('MATIC') 

    expect(payment.currency).to.be.equal('USDC') 

    expect(payment.txid).to.be.equal(txid)

  })

  it('#parsePayments should accept a raw transaction and return a parsed USDC payment', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'USDC' });

    let txid = '0x7e9989da83c3ee7b44e157a51dd1d384eaebb8109c81de78cec6ede10eec986f'

    let txhex = '0x02f8b28189808522bfb85e118522bfb85e1182d20e942791bca1f2de4661ed88a30c99a7a9449aa8417480b844a9059cbb0000000000000000000000004dc29377f2ae10bec4c956296aa5ca7de47692a20000000000000000000000000000000000000000000000000000000000002710c001a092522ee630e5bd3aa82c5be3d2bd35050c2b91b2d7fe40f86558e1794e5a114fa06a23a77fb76a758c8b8bc6fda5d507fff14fc16583fe86dde6e246328b0a77bf'

    let payments: Payment[] = await plugin.parsePayments(txhex)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x4dc29377f2ae10bec4c956296aa5ca7de47692a2') 

    expect(payment.amount).to.be.equal(0.01)

    expect(payment.chain).to.be.equal('MATIC') 

    expect(payment.currency).to.be.equal('USDC') 

    expect(payment.txid).to.be.equal(txid)

  })

})

