

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

    let txhex = '0x02f8b382a86a808505d21dba008505d21dba0082be2a94b97ef9ef8734c71904d8002f8b6bc66dd9c48a6e80b844a9059cbb0000000000000000000000004dc29377f2ae10bec4c956296aa5ca7de47692a200000000000000000000000000000000000000000000000000000000000003e8c080a0b851b93f9fea4f7a114c4436335ad6beb12a37df774c53481737deaef7d48d0ea010b4b53c2ccf11c2d61cf58f059e7b976b24ad1978ad3a08655082b0c0103771'

    let payments: Payment[] = await plugin.parsePayments(txhex)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486') 

    expect(payment.amount).to.be.equal(0.01)

    expect(payment.chain).to.be.equal('AVAX') 

    expect(payment.currency).to.be.equal('USDC') 

    expect(payment.txid).to.be.equal(txid)

  })

})

