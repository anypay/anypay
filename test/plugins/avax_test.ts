
import { find } from '../../lib/plugins'

import { Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('AVAX', () => {

  it('should find the plugin for AVAX', async () => {

    let plugin = await find({ chain: 'AVAX', currency: 'AVAX' })

    expect(plugin.currency).to.be.equal('AVAX')

    expect(plugin.chain).to.be.equal('AVAX')

    expect(plugin.decimals).to.be.equal(18)

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'AVAX', currency: 'AVAX' });

    let txid = '0x08374e97eb817fdbd8eb8eddb6e2f4693436dafbdfb7dd2adb4c07300c7a253e'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('0x195e761cecea1cf5d9faf4540a87b685449439f9df65216536b1dddbd1ec3544')

    expect(height).to.be.equal(29994194)

    expect(timestamp).to.be.a('date')

  })

  it('#getPayments should accept a txid and return a parsed AVAX payment', async () => {

    let plugin = await find({ chain: 'AVAX', currency: 'AVAX' });

    let txid = '0xb638f12c53631d9e7f26c352af51aa1f52ae496686c954ebf6233802c9d92abd'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x4da4BCf92ab8160906e5123C52dA6C61A165Adc4') 

    expect(payment.amount).to.be.equal(1.1265759) 

    expect(payment.chain).to.be.equal('AVAX') 

    expect(payment.currency).to.be.equal('AVAX') 

    expect(payment.txid).to.be.equal(txid)

  })

})

