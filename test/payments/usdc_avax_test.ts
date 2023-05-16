
require('dotenv').config()

import { avalanche } from 'usdc'

import * as erc20 from '../../lib/erc20'

import { find } from '../../lib/plugins'

import { expect } from 'chai'

const mnemonic = process.env.anypay_wallet_mnemonic

describe("Sending USDC Payments on AVAX", () => {

  it("should get the wallet address from the seed phrase", () => {

    let address = avalanche.getAddressFromMnemonic({ mnemonic })

    expect(address).to.be.a('string')

  })

  it("should build and sign a USDC transfer", async () => {

    const plugin = await find({ chain: 'AVAX', currency: 'USDC' })

    let address = '0x4DC29377F2aE10BEC4c956296Aa5Ca7de47692a2'

    let amount = 0.001 * Math.pow(10, plugin.decimals)

    const providerURL = process.env.infura_avalanche_url

    const { txhex, txid } = await erc20.buildERC20Transfer({
      address,
      amount,
      mnemonic,
      network: 'avalanche',
      providerURL,
      token: plugin.token
    })

    expect(txhex).to.be.a('string')

    expect(txid).to.be.a('string')

    let result = await erc20.broadcastSignedTransaction({ txhex, providerURL })

    expect(result.transactionHash).to.be.equal(txid)

  })

})

