

import { find } from '../../lib/plugins'

import { Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('USDC on AVAX', () => {

  it('#getPayments should accept a txid and return a parsed USDC payment', async () => {

    let plugin = await find({ chain: 'AVAX', currency: 'USDC' });

    let txid = '0x787a63918cab3cdd6470002283697f0cd5374123d690958ea0e534f25a93bd61'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486')

    expect(payment.amount).to.be.equal(0.1)

    expect(payment.chain).to.be.equal('AVAX') 

    expect(payment.currency).to.be.equal('USDC') 

    expect(payment.txid).to.be.equal(txid)

  })

  it.skip('#parsePayments should accept a raw transaction and return a parsed USDC payment', async () => {

    let plugin = await find({ chain: 'AVAX', currency: 'USDC' });

    let txid = '0x787a63918cab3cdd6470002283697f0cd5374123d690958ea0e534f25a93bd61'

    let txhex = ''

    let payments: Payment[] = await plugin.parsePayments(txhex)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486') 

    expect(payment.amount).to.be.equal(0.1)

    expect(payment.chain).to.be.equal('AVAX') 

    expect(payment.currency).to.be.equal('USDC') 

    expect(payment.txid).to.be.equal(txid)

  })

})

