
import * as utils from '../../utils'

import { expect, server } from '../../utils'

import { Invoice } from '../../../lib/invoices'

import { listInvoiceEvents } from '../../../lib/events'

describe('Integration | Accounts', () => {

  describe("Listing Events Related To Account", () => {

    it('gets the account events list from the API', async () => {

      let account = await utils.createAccount()

      let response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events`
      })
      
      expect(response.statusCode).to.be.equal(200)

      expect(response.result.events).to.be.an('array')

      expect(response.result.events[0].type).to.be.equal('account.created')

      expect(response.result.events[0].account_id).to.be.equal(account.id)

    })

  })

  describe("Getting Invoice Data", () => {

    it.skip("should have notes attached once they are created")

  })

  describe("Managing, Cancelling Invoice", () => {

  })

})
