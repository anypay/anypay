
require('dotenv').config()

import { polygon } from 'usdc'

import { expect } from 'chai'

const mnemonic = process.env.anypay_wallet_mnemonic

describe("Sending USDC Payments on MATIC", () => {

  it("should get the wallet address from the seed phrase", () => {

    let address = polygon.getAddressFromMnemonic({ mnemonic })

    expect(address).to.be.a('string')

  })

  it("should build and sign a USDC transfer", async () => {

    let address = '0x4DC29377F2aE10BEC4c956296Aa5Ca7de47692a2'

    let amount = 0.01 * Math.pow(10, 6)

    const {txhex, txid} = await polygon.buildUSDCTransfer({
      to: address,
      amount,
      mnemonic
    })

    expect(txhex).to.be.a('string')

    expect(txid).to.be.a('string')

    let result = await polygon.broadcastSignedTransaction({ txhex })

    expect(result.transactionHash).to.be.equal(txid)

  })

})
