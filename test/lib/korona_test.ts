
import * as korona from '../../lib/korona_pos'

import { generateAccount } from '../utils'

describe("Korona POS Functions", () => {

  it("#recordOrder should record a Korona order with an account", async () => {

    let account = await generateAccount()

    let demoOrder = korona.demoOrder()

    let record = await korona.recordOrder(account.id, demoOrder)

  })

  it("#handleOrder should both record an order and create an invoice", async () => {

    let account = await generateAccount()

    let demoOrder = korona.demoOrder()

    let { order, invoice } = await korona.handleOrder(account.id, demoOrder)

  })

})

