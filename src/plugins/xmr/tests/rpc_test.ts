
//import { expect } from '../../../test/utils'
//import { load_monerod_rpcs, load_monero_wallet_rpcs, MonerodRpc, MoneroWalletRpc } from '..'

describe('Monerod JSON RPC', () => {

  it.skip('should load multiple monerod rpc clients from a config', async () => {

    /*const monerodRpcClients: MonerodRpc = await load_monerod_rpcs([

    ])

    const moneroWalletRpcClients: MoneroWalletRpc[] = await load_monero_wallet_rpcs([

    ])
    */
  })

  it.skip('should load a pool of Monerod Rpc clients and get requests from that', async () => {


    /*
    const monerodRpc = MonerodRpc.fromPool([{


    }])

    let result = await monerodRpc.call('get_info')

    expect(result)
    */
  })

  it('should get the raw transaction hex given a txid')

  it('should decode the raw transaction into json given its hex')

  it('should get the decoded transaction json given a txid')

  it('should submit at transaction to the node but not broadcast')

  it('should submit at transaction to the node and broadcast')

  it('should re-broadcast at transaction that has been submitted')

  it('should re-broadcast at transaction that has been submitted')


  describe('Specific RPC Methods', () => {

    it("#get_block_count should look up how many blocks are in the longest chain known to the node.")

    it("#on_get_block_hash should look up a block's hash by its height")

  })

})
