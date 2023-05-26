
import PaymentRequest from './payment_request'
import PaymentOption from './payment_option'
import Invoice from './invoice'
import Confirmation from './confirmation'
import Payment from './payment'
import Transaction from './transaction'

module.exports = {
	PaymentRequest,
	PaymentOption,
	Invoice,
	Confirmation,
	Payment,
	Transaction,
}

module.exports.Confirmation = Confirmation

module.exports.Payment = Payment

import axios from 'axios'

export async function createInvoice({accessToken, amount}:{accessToken: string, amount:number}):Promise<any>{

}
