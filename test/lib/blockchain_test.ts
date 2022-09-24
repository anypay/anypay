
import { getTransaction } from '../../lib/blockchain'

describe('lib/blockchain', () => {

  it('#getTransaction for DOGE should use blockchair', async () => {

    getTransaction('BTC', 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d')

  })


  it('#getTransaction for BSV should use whatsonchain', async () => {

    await getTransaction('BSV', '083d472ee02d7618395823dfaec45e945bb169ee767e71c2c62565b25359a23a')

  })

})
