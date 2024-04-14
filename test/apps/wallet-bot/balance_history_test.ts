/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { expect, walletBot } from "../../utils"

import { AddressBalanceUpdate } from '../../../apps/wallet-bot'

import { PrivateKey } from 'scrypt-ts'

describe("Tracking Wallet Bot Balances", () => {


    it('#getAddressBalanceHistory should show the history of balances for a given address', async () => {

      const address = new PrivateKey().toAddress().toString()

      const history: AddressBalanceUpdate[] = await walletBot.getAddressHistory({
        address,
        currency: 'USDC',
        chain: 'BSV',
        offset: 0,
        limit: 10
      })

      expect(history.length).to.be.equal(0)

      await walletBot.setAddressBalance({
        address,
        balance: 1,
        currency: 'USDC',
        chain: 'BSV'
      })

      expect(history.length).to.be.equal(1)

      await walletBot.setAddressBalance({
        address,
        balance: 1,
        currency: 'USDC',
        chain: 'BSV'
      })

      expect(history.length).to.be.equal(1)

      await walletBot.setAddressBalance({
        address,
        balance: 0.5,
        currency: 'USDC',
        chain: 'BSV'
      })

      expect(history.length).to.be.equal(2)

    })

    it('#updateAddressBalance should do nothing if the balance has not changed since the last time', async () => {

    })

    it('#updateAddressBalance should record a new entry when the balance changes', async () => {

      const address = new PrivateKey().toAddress().toString()

      const [firstEntry, isChanged] = await walletBot.setAddressBalance({
        address,
        balance: 1,
        currency: 'USDC',
        chain: 'BSV'
      })

      expect(firstEntry.balance).to.be.equal(1)
      expect(isChanged).to.be.equal(true)

      const [secondEntry, isChanged2] = await walletBot.setAddressBalance({
        address,
        balance: 1,
        currency: 'USDC',
        chain: 'BSV'
      })

      expect(secondEntry.balance).to.be.equal(1)
      expect(isChanged2).to.be.equal(false)

      const [thirdEntry, isChanged3] = await walletBot.setAddressBalance({
        address,
        balance: 0.5,
        currency: 'USDC',
        chain: 'BSV'
      })

      expect(thirdEntry.difference).to.be.equal(-0.5)
      expect(isChanged3).to.be.equal(true)

    })


    it('#createPaymentRequest should add webhook_url to the underlying invoice', async () => {


    })

})
