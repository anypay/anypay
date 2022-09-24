
import { getBlockExplorerTxidUrl } from '../../lib/block_explorer'

import { expect, account } from '../utils'

describe('lib/block_explorer', () => {

  it('the default test account should be a Account', async () => {

    expect(account).to.be.not.equal(null)

    expect(account.email).to.be.a('string')

    expect(account.denomination).to.be.a('string')

  })

  it('should get a url for all coins', async () => {

    var url = getBlockExplorerTxidUrl({
        currency: 'BSV',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

    var url = getBlockExplorerTxidUrl({
        currency: 'BTC',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

    var url = getBlockExplorerTxidUrl({
        currency: 'BCH',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

    var url = getBlockExplorerTxidUrl({
        currency: 'DASH',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

    var url = getBlockExplorerTxidUrl({
        currency: 'XMR',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

    var url = getBlockExplorerTxidUrl({
        currency: 'LTC',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

    var url = getBlockExplorerTxidUrl({
        currency: 'DOGE',
        txid: 'abcdefg'
    })

    expect(url).to.be.a('string')

  })

})
