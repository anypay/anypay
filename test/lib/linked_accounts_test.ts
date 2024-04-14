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

import { expect, account, generateAccount } from '../utils'

import { linkAccount, listLinkedAccounts, getLink, unlinkAccount } from '../../lib/linked_accounts'

describe('lib/linked_accounts', () => {

  it('the default test account should be a Account', async () => {

    expect(account).to.be.not.equal(null)

    expect(account.email).to.be.a('string')

    expect(account.denomination).to.be.a('string')

  })

  it("#listLinkedAccounts should return a list of linked accounts", async () => {

    const alice = await generateAccount()

    const bob = await generateAccount()

    const { source: alice_source, target: alice_target } = await listLinkedAccounts(alice)

    const { source: bob_source, target: bob_target } = await listLinkedAccounts(bob)

    expect(alice_source.length).to.be.equal(0)

    expect(alice_target.length).to.be.equal(0)

    expect(bob_source.length).to.be.equal(0)

    expect(bob_target.length).to.be.equal(0)

    await linkAccount(alice, {
      email: String(bob.email)
    })

    const { source: alice_source_new, target: alice_target_new } = await listLinkedAccounts(alice)

    const { source: bob_source_new, target: bob_target_new } = await listLinkedAccounts(bob)

    expect(alice_source_new.length).to.be.equal(1)

    expect(alice_target_new.length).to.be.equal(0)

    expect(bob_source_new.length).to.be.equal(0)

    expect(bob_target_new.length).to.be.equal(1)


  })

  it("#linkAccount should link one account to another", async () => {

    const targetAccount = await generateAccount()

    const linkedAccount = await linkAccount(account, {
      email: String(targetAccount.email)
    })

    expect(linkedAccount.source).to.be.equal(account.id)

    expect(linkedAccount.target).to.be.equal(targetAccount.id)

  })

  it("#unlinkAccount should un-link one account from another", async () => {

    const targetAccount = await generateAccount()

    await linkAccount(account, {
      email: String(targetAccount.email)
    })

    const link = await getLink({ 
        source: account.id,
        target: targetAccount.id
    })

    if (!link) {
      throw new Error('Link not found')
    }

    await unlinkAccount(account, { id: String(link.id) })

  })

  it("#linkAccount should fail with an invalid email", async () => {

    expect(

        linkAccount(account, { email: 'invalid@test.tech '})
    )
    .to.be.eventually.rejected

  })

})