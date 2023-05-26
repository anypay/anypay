
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

import * as Cards from './cards'

import PaymentOption from './payment_option'

import PaymentRequest from './payment_request'

import Transaction from './transaction'

export {

  Cards,

  PaymentOption,

  PaymentRequest,

  Transaction

}

const Wallet = {

  Cards,

  PaymentOption,

  PaymentRequest,

  Transaction

}

export default Wallet

