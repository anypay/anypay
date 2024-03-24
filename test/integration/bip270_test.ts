require('dotenv').config()

import { expect, request } from '../utils'

import * as utils from '../utils'

import prisma from '../../lib/prisma'
import { config } from '../../lib'

describe("BIP270 Payment Requests", () => {

  describe("BSV", () => {

    it('should return a valid BIP270 payment request', async () => {

      const account = await utils.generateAccount()

      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`)

      expect(resp.body.outputs.length).to.be.greaterThan(0)

      expect(resp.body.outputs[0].amount).to.be.greaterThan(0)

      expect(resp.body.outputs[0].script).to.be.a('string')

      expect(resp.body.paymentUrl).to.be.a('string')

      expect(resp.statusCode).to.be.equal(200)

    })

    if (!config.get('SKIP_E2E_PAYMENTS_TESTS')) {

      it('an invalid payment should be rejected', async () => {

        const account = await utils.generateAccount()

        let invoice = await utils.newInvoice({ amount: 0.02, account })

        let resp = await request
          .get(`/r/${invoice.uid}`) 

        let transaction = "INVALID"
          
        expect(transaction).to.be.a('string')

        let url = (() => { // convert url into local url with no host for test

          console.log('RESP BODY', resp.body)

          console.log('--payment url--', resp.body.paymentUrl)

          let url = resp.body.paymentUrl.replace('undefined', '')

          let parts = url.split('://')[1].split('/')

          parts.shift()

          parts.unshift('/')

          return parts.join('/')

        })()

        try {

          let submitResponse = await request.post(url).send({
            transaction
          }) 

          expect(submitResponse.statusCode).to.be.not.equal(200)

        } catch(error) {

          throw error

        }

      })

    }

    /*if (!config.get('SKIP_E2E_PAYMENTS_TESTS')) {

      it.skip('should accept a valid payment for a BIP270 payment request', async () => {

        let invoice = await utils.newInvoice({ amount: 0.02 })

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

        let url = resp.body.paymentUrl.replace('https://api.anypayx.com', '')

        let submitResponse = await request.post(url).send({
          transaction
        }) 

        expect(submitResponse.statusCode).to.be.equal(200)

        expect(submitResponse.body.error).to.be.equal(0)

        expect(submitResponse.body.payment.transaction).to.be.equal(transaction)

        expect(submitResponse.body.memo).to.be.a('string')

      })

    }*/

    it.skip('should reject payment for an invoice that was cancelled', async () => {

      const account = await utils.generateAccount()

      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 

      let transaction = "INVALID"
        
      expect(transaction).to.be.a('string')

      let url = resp.body.paymentUrl.replace('undefined', '')

      await prisma.invoices.update({
        where: {
          id: invoice.id
        },
        data: {
          cancelled: true
        }
      })

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

