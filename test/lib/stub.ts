require('dotenv').config()

import * as assert from 'assert' 
import * as stub from '../../lib/stub'
import { models } from '../../lib/models'

import * as utils from '../utils'

describe("Adding a stub to an account", () => {

  it("should use the business name by default", () => {

    var accountStub = stub.build({ business_name: 'La Carreta' })

    assert.strictEqual(accountStub, 'la-carreta')

    accountStub = stub.build({
      business_name: 'La Carreta',
      city: 'Portsmouth'
    })

    assert.strictEqual(accountStub, 'la-carreta-portsmouth')

  })

  it("should automatically update the stub on the model", async () => {

    let account = await utils.generateAccount()

    account.business_name = "Jason's Deli"

    await account.save()

    assert.strictEqual(account.stub, 'jasons-deli')

    await account.destroy()

  })

  it("should prevent saving the stub if one with that stub already exists", async () => {

    let account1 = await utils.generateAccount()
    let account2 = await utils.generateAccount()

    account1.business_name = "HEB Supermarket"
    account2.business_name = "HEB Supermarket"

    await account1.save()

    assert.strictEqual(account1.stub, 'heb-supermarket')

    await account2.save()

    assert.strictEqual(account2.stub, null)

    await account1.destroy()
    await account2.destroy()

  })

  it("should try to use the city in case of a conflict", async () => {

    let account1 = await utils.generateAccount()
    let account2 = await utils.generateAccount()

    account1.business_name = "HEB Supermarket"

    account2.business_name = "HEB Supermarket"
    account2.city = "San Antonio"

    await account1.save()

    assert.strictEqual(account1.stub, 'heb-supermarket')

    await account2.save()

    assert.strictEqual(account2.stub, 'heb-supermarket-san-antonio')

    await account1.destroy()
    await account2.destroy()

  })

  it('#stub.updateAccount should default to using account id if no business name exists', async () => {

    let account = await utils.generateAccount()

    await stub.updateAccount(account, models.Account)

    assert.strictEqual(account.stub, account.id)

    await account.destroy()

  })

})
