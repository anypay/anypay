
import axios from 'axios'

import * as protocol from './protocol'

import { log } from './log'

export class Client {

  url: string;

  constructor(url: string) {

    this.url = url

  }

  async getPaymentOptions(): Promise<protocol.PaymentOptions> {

    let { data } = await axios.get(this.url, {
      headers: {
        'x-paypro-version': 2,
        'accept': 'application/payment-options'
      }
    })

    return data

  }

  async selectPaymentOption(params: protocol.SelectPaymentRequest): Promise<protocol.PaymentRequest> {

    let { data } = await axios.post(this.url, params, {
      headers: {
        'x-paypro-version': 2,
        'content-type': 'application/payment-request'
      }
    })

    return data

  }

  async verifyPayment(params: protocol.PaymentVerificationRequest): Promise<protocol.PaymentVerification> {

    let { data } = await axios.post(this.url, params, {
      headers: {
        'x-paypro-version': 2,
        'content-type': 'application/payment-verification'
      },

    })

    return data

  }

  async transmitPayment(

    params: protocol.PaymentRequest,

    transaction: string,

    options?: any

  ): Promise<protocol.PaymentResponse> {

    log.info('wallet-bot.simple-wallet.transmitPayment', { params, transaction, options })

    var payment: protocol.SendPayment;

    if (params.chain === 'XMR') {

      payment = {

        chain: params.chain,

        currency: params.chain,

        transactions: [{ tx: transaction, tx_key: options.tx_key, tx_hash: options.tx_hash }]
      }

    } else {

      payment = {

        chain: params.chain,

        currency: params.chain,

        transactions: [{ tx: transaction }]
      }

    }

    let { data } = await axios.post(this.url, payment, {
      headers: {
        'x-paypro-version': 2,
        'content-type': 'application/payment'
      }
    })

    return data

  }

  async sendPayment(

    params: protocol.Payment

  ): Promise<protocol.PaymentResponse> {

    let { data } = await axios.post(this.url, params, {
      headers: {
        'x-paypro-version': 2,
        'content-type': 'application/payment'
      }
    })

    return data

  }

}

