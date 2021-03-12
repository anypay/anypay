
import { BigNumber } from 'bignumber.js';
import { models } from '../models'
import { logInfo } from '../logger'

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

