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
import { Confirmation } from '../../lib/confirmations'

describe("BSV", () => {

  it('should find the plugin for BSV', async () => {

    let plugin = await find({ chain: 'BSV', currency: 'BSV' })

    expect(plugin.currency).to.be.equal('BSV')

    expect(plugin.chain).to.be.equal('BSV')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'BSV', currency: 'BSV' });

    let txid = 'de2b352e1849392a7fce7a8fa2f6295d922307303b007d3804f9589b66624028'

    let { confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

    expect(confirmation_hash).to.be.equal('0000000000000000003a7c1fa88eb6134c0f8b4027e1b1e753079181a462d99a')

    expect(confirmation_height).to.be.equal(791940)

    expect(confirmation_date).to.be.a('date')

  })

})

