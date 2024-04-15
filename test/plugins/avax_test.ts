/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { find } from '../../lib/plugins'

import {  Payment } from '../../lib/plugin'

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

    let confirmation = await plugin.getConfirmation(txid)

    if (!confirmation) {
      throw new Error('No confirmation found')
    }

    expect(confirmation.confirmation_height).to.be.greaterThan(0)

    expect(confirmation.confirmation_hash).to.be.equal('0x195e761cecea1cf5d9faf4540a87b685449439f9df65216536b1dddbd1ec3544')

    expect(confirmation.confirmation_height).to.be.equal(29994194)

    expect(confirmation.confirmation_date).to.be.a('date')

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

