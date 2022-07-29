
import { auth, expect, account } from '../../utils'

describe("Searching", async () => {

  it('should find an invoice by txid with the api', async () => {

    const txid = ''

    const { result } = await auth(account)({
      method: 'POST',
      url: '/v1/api/search',
      payload: {
        search: txid
      }
    })

    expect(result.invoices.length).to.be.equal(1)

    const invoice = result.invoices[0]

    expect(invoice.hash).to.be.equal(txid)

  })

});

