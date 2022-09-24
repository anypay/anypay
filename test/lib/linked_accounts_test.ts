
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

    await linkAccount(alice, bob)

    const { source: alice_source_new, target: alice_target_new } = await listLinkedAccounts(alice)

    const { source: bob_source_new, target: bob_target_new } = await listLinkedAccounts(bob)

    expect(alice_source_new.length).to.be.equal(1)

    expect(alice_target_new.length).to.be.equal(0)

    expect(bob_source_new.length).to.be.equal(0)

    expect(bob_target_new.length).to.be.equal(1)


  })

  it("#linkAccount should link one account to another", async () => {

    const targetAccount = await generateAccount()

    const linkedAccount = await linkAccount(account, targetAccount)

    expect(linkedAccount.get('source')).to.be.equal(account.id)

    expect(linkedAccount.get('target')).to.be.equal(targetAccount.id)

  })

  it("#unlinkAccount should un-link one account from another", async () => {

    const targetAccount = await generateAccount()

    await linkAccount(account, targetAccount)

    const link = await getLink({ 
        source: account.id,
        target: targetAccount.id
    })

    await unlinkAccount(account, { id: link && link.get('id') })

  })

  it("#linkAccount should fail with an invalid email", async () => {

    expect(

        linkAccount(account, { email: 'invalid@test.tech '})
    )
    .to.be.eventually.rejected

  })

})
