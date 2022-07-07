
import { auth, v0AuthRequest, expect } from '../../utils'

import { search } from '../../../lib/search'

import * as utils from '../../utils'

describe("Searching", async () => {

  it('should find an invoice by txid with the library', async () => {

    const txid = ''

    const { invoices } = await search({ txid, account })

    expect(invoices.length).to.be.equal(1)

    const invoice = invoices[0]

    expect(invoice.hash).to.be.equal(txid)

  })

  it('should find an invoice by txid with the api', async () => {

    const txid = ''

    const { result } = await auth(account)({
      method: 'POST',
      url: '/v1/api/search',
      payload:
        search: txid
      }
    })

    expect(result.invoices.length).to.be.equal(1)

    const invoice = result.invoices[0]

    expect(invoice.hash).to.be.equal(txid)

  })

})

