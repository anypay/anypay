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

describe("XRP", () => {

  it('should find the plugin for XRP', async () => {

    let plugin = await find({ chain: 'XRP', currency: 'XRP' })

    expect(plugin.currency).to.be.equal('XRP')

    expect(plugin.chain).to.be.equal('XRP')

  })

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'XRP', currency: 'XRP' });

    let txid = '8F3A872BA256DAEAB6634E6CFE346DD0F02347C28DF37A3B4D26FB6D29CA9C2D'

    let { confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

    expect(confirmation_hash).to.be.equal('13B9FFF7C1A0D5C36DA1442130F2AA3D2537C414CDDB9A2FFEEE918D89CC458D')

    expect(confirmation_height).to.be.equal(79781368)

    expect(confirmation_date).to.be.a('date')

  })

})

