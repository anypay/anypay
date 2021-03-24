
import { BigNumber } from 'bignumber.js';
import { models } from '../models'
import { logInfo } from '../logger'

import { Op } from 'sequelize'

import * as sequelize from '../database'

/*
 * Get Balance
 * ___________
 *
 * The balance is the sum of credits minus the sum of debits
 *
 */
export async function getBalance(account_id: number) {

  logInfo('anypayx.getbalance', { account_id })

  let sumCreditsResult = await models.AnypayxCredit.findAll({
    where: {
      account_id
    },
    attributes: [
      'account_id',
      [sequelize.fn('sum', sequelize.col('amount')), 'sumCredits']
    ],
    group: ['account_id']
  })

  //logInfo('anypayx.sumcredits.result', sumCreditsResult[0].sumCredits)
  let sumCredits = sumCreditsResult && sumCreditsResult[0] ? sumCreditsResult[0].dataValues.sumCredits || 0 : 0

  let sumDebitsResult = await models.AnypayxDebit.findAll({
    where: {
      account_id
    },
    attributes: [
      'account_id',
      [sequelize.fn('sum', sequelize.col('amount')), 'sumDebits']
    ],
    group: ['account_id']
  })

  let sumDebits = sumDebitsResult && sumDebitsResult[0] ? sumDebitsResult[0].dataValues.sumDebits || 0 : 0

  let balance = (new BigNumber(sumCredits)).minus(new BigNumber(sumDebits)).toNumber()

  logInfo('anypayx.getbalance.result', {
    sumCredits: sumCredits,
    sumDebits: sumDebits,
    balance
  })

  return balance

}

/*
 * List All Debits And Credits For Account
 * sorted by most recent first
 *
 */
export async function listTransactions(account_id: number) {

  let debits: any[] = await models.AnypayxDebit.findAll({ where: { account_id }})
  let credits: any[] = await models.AnypayxCredit.findAll({ where: { account_id }})

  debits = debits.map(debit => {
    return {
      type: 'debit',
      values: debit.toJSON()
    }
  })

  credits = credits.map(credit => {
    return {
      type: 'credit',
      values: credit.toJSON()
    }
  })

  let transactions = [debits, credits]
    .reduce((accumulator, value) => accumulator.concat(value), []) // flatten
    .sort((a: any, b: any) => {
      let b_date = new Date(b.values.date)
      let a_date = new Date(a.values.date)
      return b_date > a_date ? 1 : -1; 
    })

  return transactions
}

/*
 * settleAccount will compute the current outstanding balance
 * and create a settlement credit with the default settlement strategy
 *
 */
export async function settleAccount(account_id: number) {
  logInfo('anypayx.settleaccount',{ account_id })

  let amount = await getBalance(account_id)

  if (amount === 0) {
    throw new Error('account balance is zero, cannot create settlement')
  }

  let debit = await models.AnypayxDebit.create({
    account_id,
    amount,
    currency: 'USD',
    date: new Date()
  })

  logInfo('anypayx.debit.created', { debit })

  return debit.toJSON()

}

/*
 * For a given paid invoice, credit the account for that amount
 * If the invoice is not paid, throw an error. If the invoice has
 * already been credited to the account, throw an error.
 *
 */
export async function creditInvoice(invoice_uid: string): Promise<[any, boolean]> {

  let invoice = await models.Invoice.findOne({ where: { uid: invoice_uid }})

  if (invoice.status !== 'paid') {

    throw new Error(`cannot credit unpaid invoice with uid ${invoice_uid}`)
  }

  var amount = invoice.denomination_amount_paid

  // Apply Legacy Cashback For eGifter
  if (invoice.cashback_denomination_amount > 0) {
    amount = new BigNumber(amount).minus(invoice.cashback_denomination_amount).toNumber()
  }

  let result: [any, boolean] = await models.AnypayxCredit.findOrCreate({
    where: {
      invoice_uid
    },
    defaults: {
      account_id: invoice.account_id,
      invoice_uid,
      currency: invoice.denomination_currency,
      amount,
      date: new Date()
    }
  })

  return [result[0].toJSON(), result[1]]

}

/*
 *
 * For a given ACH batch that was sent debit the account for that amount
 * If the ACH does not yet have an effective date throw an error. Total
 * amount should represent the sum of the account's invoices related to the ACH.
 *
 */

async function debitACH(id) {

  var debit = await models.AnypayxDebit.findOne({
    where: {
      settlement_id: id,
      settlement_type: 'ach_batch'
    }
  })

  if (debit) {
    throw new Error(`ach_batch ${id} already debited from AnypayX account`)
  }

  let ach_batch = await models.AchBatch.findOne({ where: { id }})

  debit = await models.AnypayxDebit.create({
    settlement_id: id,
    settlement_type: 'ach_batch',
    amount: ach_batch.id,
    currency: 'USD',
    date: new Date(),
    account_id: ach_batch.account_id,
    external_id: id
  })

  return debit

}
interface DebitSettlement {
  settlement_type: string;
  settlement_id: number;
}
export async function debitSettlement(params: DebitSettlement) {
  switch(params.settlement_type) {
    case 'ach_batch': 
      return debitACH(params.settlement_id)
    case 'bitpay': 
      return debitBitpaySettlement(params.settlement_id)
    default:
      throw new Error(`settlement type ${params.settlement_type} not yet supported`)
  }
}

export async function debitBitpaySettlement(bitpay_settlement) {

  let debit = await models.AnypayxDebit.findOrCreate({
    where: {
      settlement_type: 'bitpay',
      settlement_id: bitpay_settlement.id
    },
    defaults: {
      settlement_type: 'bitpay',
      settlement_id: bitpay_settlement.id,
      amount: bitpay_settlement.id,
      currency: bitpay_settlement.currency,
      date: new Date(),
      account_id: bitpay_settlement.account_id,
      external_id: bitpay_settlement.url.split('=')[1]
    }
  })

  return debit

}

export async function debitAllACH(start_date, end_date) {

  let ach_batches = await models.AchBatch.findAll({
    where: {
      effective_date: {
        [Op.gt]: start_date,
        [Op.lt]: end_date || new Date()
      }
    }
  })

  for (let batch of ach_batches) {

    try {

      let debit = await debitSettlement({
        settlement_type: 'ach_batch',
        settlement_id: batch.id
      })

      console.log('debit', debit.toJSON())

    } catch(error) {

      console.error(error)

    }
    
  }

}

export async function creditAllInvoices(account_id) {

  let invoices = await models.Invoice.findAll({
    where: {
      account_id,
      status: 'paid'
    }
  })

  for (let invoice of invoices) {

    try {

      await creditInvoice(invoice.uid)

    } catch(error) {

      console.error(error)

    }

  }

}

