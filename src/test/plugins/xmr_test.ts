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

import { find } from '@/lib/plugins'
import { Confirmation } from '@/lib/confirmations';

describe('XMR', () => {

  it('should find the plugin for XMR', async () => {

    let plugin = await find({ chain: 'XMR', currency: 'XMR' });

    expect(plugin.currency).to.be.equal('XMR')

    expect(plugin.chain).to.be.equal('XMR')

    expect(plugin.decimals).to.be.equal(12)

  });

  it('#getConfirmation should return block data for confirmed transaction', async () => {

    let plugin = await find({ chain: 'XMR', currency: 'XMR' });

    let txid = '58f8df857270cfc783c7dfb5e58c69e8dee5b9113242b52cefc62b4296fbcec3'

    let { confirmation_hash, confirmation_height, confirmation_date } = await plugin.getConfirmation(txid) as Confirmation

    expect(confirmation_hash).to.be.equal('cc3d8eace4332c99e13aa915c1f7521490c3f91054cfc7500fce6ec58f66c98a')

    expect(confirmation_height).to.be.equal(2885963)

    expect(confirmation_date).to.be.a('date')

  })

})

