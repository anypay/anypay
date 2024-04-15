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

import { Confirmation, Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('USDT on ETH', () => {

  it('should find the plugin for ETH', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'USDT' })

    expect(plugin.currency).to.be.equal('USDT')

    expect(plugin.chain).to.be.equal('ETH')

    expect(plugin.decimals).to.be.equal(6)

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'USDT' });

    let txid = '0x52ff131ac073f919981f8d57277bc0ef541dcc191cddbf8f9d59f727e0cd729e'

    let { confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

    expect(confirmation_hash).to.be.equal('0x11d50922d34f18e662080ff3dd99f6c7cfea86a2fb8d094f33134f2dc658def8')

    expect(confirmation_height).to.be.equal(17263546)

    expect(confirmation_date).to.be.a('date')

  })

  it('#getPayments should accept a txid and return a parsed USDT payment', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'USDT' });

    let txid = '0x52ff131ac073f919981f8d57277bc0ef541dcc191cddbf8f9d59f727e0cd729e'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x39c551cadf430db3198c90786538af8795d544c4') 

    expect(payment.amount).to.be.equal(158.550843)

    expect(payment.chain).to.be.equal('ETH') 

    expect(payment.currency).to.be.equal('USDT') 

    expect(payment.txid).to.be.equal(txid)

  })

  it('#parsePayments should accept a raw transaction and return a parsed USDT payment', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'USDT' });

    let txid = '0x52ff131ac073f919981f8d57277bc0ef541dcc191cddbf8f9d59f727e0cd729e'

    let txhex = '0x02f8b30182012a8405f5e100850db659ee2a8301725d94dac17f958d2ee523a2206206994597c13d831ec780b844a9059cbb00000000000000000000000039c551cadf430db3198c90786538af8795d544c40000000000000000000000000000000000000000000000000000000009734b3bc001a0f5fd47ba96c4776c64e42e396c72d96561982f5a4e433631700fcd08bf155d85a052bf989638b43ba5ba58b209e4df4e6720d86b834711a072bbd22279fb284861'

    let payments: Payment[] = await plugin.parsePayments({txhex})

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x39c551cadf430db3198c90786538af8795d544c4') 

    expect(payment.amount).to.be.equal(158.550843)

    expect(payment.chain).to.be.equal('ETH') 

    expect(payment.currency).to.be.equal('USDT') 

    expect(payment.txid).to.be.equal(txid)

  })

})

