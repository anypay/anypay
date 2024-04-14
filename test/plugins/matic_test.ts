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

import { Payment } from '../../lib/plugin'

import { expect } from 'chai'

describe('MATIC', () => {

  it('should find the plugin for MATIC', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'MATIC' })

    expect(plugin.currency).to.be.equal('MATIC')

    expect(plugin.chain).to.be.equal('MATIC')

    expect(plugin.decimals).to.be.equal(18)

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'MATIC' });

    let txid = '0x494011badb5faf691bc11027c96e154da6d8ee3ab2dd70ce346900b8153b4d1c'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('0xde5a4703ca10f3176be78ee832881bfc3bae5600f06924f82ab4951b29271573')

    expect(height).to.be.equal(42680415)

    expect(timestamp).to.be.a('date')

  })

  it('#getPayments should accept a txid and return a parsed MATIC payment', async () => {

    let plugin = await find({ chain: 'MATIC', currency: 'MATIC' });

    let txid = '0xba8910906de31007bb521e9658cfcfb77b38c17b177644fe3ee51987a8fed620'

    let payments: Payment[] = await plugin.getPayments(txid)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486') 

    expect(payment.amount).to.be.equal(4.9801)

    expect(payment.chain).to.be.equal('MATIC') 

    expect(payment.currency).to.be.equal('MATIC') 

    expect(payment.txid).to.be.equal(txid)

  })

  it('#parsePayments should accept a raw transaction and return a parsed ETH payment', async () => {

    let plugin = await find({ chain: 'ETH', currency: 'ETH' });

    let txid = '0xba8910906de31007bb521e9658cfcfb77b38c17b177644fe3ee51987a8fed620'

    let txhex = '0xf86e8303062285046ee870ba8252089463fc765a644d31f87a2284fd4bf728c9d767d92187364544acb4d4008025a004193d0439037192b7c9ee4e81f30ab97292763c27fbc73244c2f7f54672e42ba05ea478ef2154f89aa3acbbd46917b40149dd5a3d3e52aa45f30332dbd8482a3f'

    let payments: Payment[] = await plugin.parsePayments(txhex)

    expect(payments.length).to.be.equal(1)

    let payment = payments[0]

    expect(payment.address).to.be.equal('0x029b705658d7de7c98176f0290cd282a0b9d1486') 

    expect(payment.amount).to.be.equal(4.9801)

    expect(payment.chain).to.be.equal('MATIC') 

    expect(payment.currency).to.be.equal('MATIC') 

    expect(payment.txid).to.be.equal(txid)

  })



})

