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

import { expect } from 'chai'

import { find } from '../../lib/plugins'

describe("BCH", () => {

  it('should find the plugin for BCH', async () => {

    let plugin = await find({ chain: 'BCH', currency: 'BCH' })

    expect(plugin.currency).to.be.equal('BCH')

    expect(plugin.chain).to.be.equal('BCH')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'BCH', currency: 'BCH' });

    let txid = '4e51acd9be7d61955838cf4ec20a294465d612f485c6615c5777b7b52320ba4f'

    let { depth, hash, height, timestamp } = await plugin.getConfirmation(txid)

    expect(depth).to.be.greaterThan(0)

    expect(hash).to.be.equal('000000000000000002a18e30eb35e7c9d12a5daa9d5ebe840d39e39ca4ac29ce')

    expect(height).to.be.equal(792678)

    expect(timestamp).to.be.a('date')

  })

})

