
import * as assert from 'assert'

import * as http from 'superagent'

import { models } from '../../lib'

describe("End To End Payment Requests With BIP70 Protobufs", () => {

  var uid = 'f6eF_inmN'
  var base_url = 'https://api.anypayinc.com'

  describe("BCH", () => {

    it('should return a valid BIP70 payment request', async () => {

      let resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/bitcoincash-paymentrequest',
          'x-currency': 'BCH'
        })

    })

  })

  describe("BTC", () => {

    it('should return a valid BIP70 payment request', async () => {

      let resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/bitcoin-paymentrequest',
          'x-currency': 'BTC'
        })

    })
  
  })

  describe("DASH", () => {

    it('should return a valid BIP70 payment request', async () => {

      let resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/dash-paymentrequest',
          'x-currency': 'DASH'
        })

    })
  
  })

})

