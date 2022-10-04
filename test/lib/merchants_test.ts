
import { expect, account } from '../utils'

import { getMerchantInfo } from '../../lib/merchants'

describe('lib/merchants', () => {

  it('the default test account should be a Account', async () => {

    const merchantInfo = await getMerchantInfo(account.id)

    expect(merchantInfo).to.be.an('object')

  })


  it('the default test account should be a Account', async () => {


    expect(

        getMerchantInfo('INVALID')

    )
    .to.be.eventually.rejected

  })

})