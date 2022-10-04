require('dotenv').config()

import * as assert from 'assert' 
import { models } from '../../lib/models'

import * as utils from '../utils'

describe("Updating Latitude and Longitude Should Set Position", () => {

  it("set the position automatically", async () => {

    let account = await utils.generateAccount()

    assert(!account.position)

    account.latitude = 10.4971784
    account.longitude = -66.8759535

    await account.save()

    account = await models.Account.findOne({ where: { id: account.id }})

    assert(account.position)

    await account.destroy()

  })

})
