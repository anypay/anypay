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

    })

    it('an invalid payment should be rejected', async () => {

      let [account, invoice] = await utils.newAccountWithInvoice({ amount: 0.02 })

      let resp = await request
        .get(`/r/${invoice.uid}`) 

      let transaction = "INVALID"
        
      expect(transaction).to.be.a('string')

      let url = resp.body.paymentUrl.replace('undefined', '')

      let submitResponse = await request.post(url).send({
        transaction
      }) 

      expect(submitResponse.statusCode).to.be.equal(500)

      expect(submitResponse.body.payment.transaction).to.be.equal(transaction)
 
      expect(submitResponse.body.error).to.be.equal(1)

      expect(submitResponse.body.memo).to.be.a('string')

    })

    if (!process.env.SKIP_E2E_PAYMENTS_TESTS) {

      it('should accept a valid payment for a BIP270 payment request', async () => {

        let [account, invoice] = await utils.newAccountWithInvoice({ amount: 0.02 })

        let resp = await request
          .get(`/r/${invoice.uid}`) 

        expect(resp.body.outputs.length).to.be.greaterThan(0)

        expect(resp.body.outputs[0].amount).to.be.greaterThan(0)

        expect(resp.body.outputs[0].script).to.be.a('string')

        expect(resp.body.paymentUrl).to.be.a('string')

        expect(resp.statusCode).to.be.equal(200)

        let transaction = await wallet.buildPayment(resp.body.outputs.map(output => {
          
          let address = new Address(new Script(output.script)).toString()

          return {

            address,

            amount: output.amount
          }

        }))

        expect(transaction).to.be.a('string')

        let url = resp.body.paymentUrl.replace('undefined', '')

        let submitResponse = await request.post(url).send({
          transaction
        }) 

        expect(submitResponse.statusCode).to.be.equal(200)

        expect(submitResponse.body.error).to.be.equal(0)

        expect(submitResponse.body.payment.transaction).to.be.equal(transaction)

        expect(submitResponse.body.memo).to.be.a('string')

      })

    }

    it('should reject payment for an invoice that was cancelled', async () => {

      let [account, invoice] = await utils.newAccountWithInvoice({ amount: 0.02 })

      let resp = await request
        .get(`/r/${invoice.uid}`) 

      let transaction = "INVALID"
        
      expect(transaction).to.be.a('string')

      let url = resp.body.paymentUrl.replace('undefined', '')

      await invoice.set('cancelled', true)

      let submitResponse = await request.post(url).send({
        transaction
      }) 

      expect(submitResponse.statusCode).to.be.equal(500)

      expect(submitResponse.body.payment.transaction).to.be.equal(transaction)
 
      expect(submitResponse.body.error).to.be.equal(1)

      expect(submitResponse.body.memo).to.be.equal('Invoice Already Cancelled')

    })

  })


})

