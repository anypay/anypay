require('dotenv').config()

import * as utils from '../utils'

import prisma from '../../lib/prisma'

describe("Updating Latitude and Longitude Should Set Position", () => {

  it("set the position automatically", async () => {

    let account = await utils.generateAccount()

    await prisma.accounts.update({
      where: {
        id: account.id
      },
      data: {
        latitude: String(10.4971784),
        longitude: String(-66.8759535)
      }
    })

    //assert(!account.position)

    account = await prisma.accounts.findFirstOrThrow({
      where: {
        id: account.id
      }
    
    })

    //assert(account.position)

    await prisma.accounts.delete({
      where: {
        id: account.id
      }
    })

  })

})
