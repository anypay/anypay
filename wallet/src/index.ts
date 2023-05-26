
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

import * as Cards from './cards'

import Instruction from './instruction'

import PaymentOption from './payment_option'

import PaymentRequest from './payment_request'

import Transaction from './transaction'

export {

  Cards,

  Instruction,

  PaymentOption,

  PaymentRequest,

  Transaction

}

