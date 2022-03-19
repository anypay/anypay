require('dotenv').config()

import * as assert from 'assert'

import { Script, Address } from 'bsv'

import * as http from 'superagent'

import { models } from '../../lib'

import { wallet, expect, server, chance, request, spy } from '../utils'

import { paymentRequestToJSON } from '../../lib/pay/bip70'

import * as utils from '../utils'

describe("BIP270 Payment Requests", () => {

  describe("BSV", () => {

    it('should return a valid BIP270 payment request', async () => {

      let [account, invoice] = await utils.newAccountWithInvoice({ amount: 0.02 })

      let resp = await request
        .get(`/r/${invoice.uid}`) 

      expect(resp.body.outputs.length).to.be.greaterThan(0)

      expect(resp.body.outputs[0].amount).to.be.greaterThan(0)

      expect(resp.body.outputs[0].script).to.be.a('string')

      expect(resp.body.paymentUrl).to.be.a('string')

      expect(resp.statusCode).to.be.equal(200)

      let payment = await wallet.buildPayment(resp.body.outputs.map(output => {
        
        let address = new Address(new Script(output.script)).toString()

        return {

          address,

          amount: output.amount
        }

      }))

      expect(payment).to.be.a('string')

    })

  })

})

