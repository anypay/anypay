
import { expect } from '../utils'

import { publish } from '../../lib/blockcypher'

describe('lib/blockcypher', () => {

  it('#publish should reject an invalid BTC transaction', async () => {
    
    expect(
        publish('BTC', 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d')
    )
    .to.be.eventually.rejected

  })

  it('#publish should reject an invalid BTC transaction', async () => {

    try {

        const result = await publish('BTC', 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d')

        console.log(result)

    } catch(error) {

        console.error(error)
    }

  })


  it('#getTransaction for BSV should use whatsonchain', async () => {

    expect(
        publish('BSV', '083d472ee02d7618395823dfaec45e945bb169ee767e71c2c62565b25359a2')
    )
    .to.be.eventually.rejected

  })

})
