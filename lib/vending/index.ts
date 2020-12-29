
import { models } from '../models'

import * as log from '../logger'

import { query } from './mysql'

interface Batm {
  account_id: number;
  id: number;
}

interface BatmTransaction {
  account_id: number;
  id: number;
}

export async function listBatmsForAccount(account_id: number): Promise<Batm[]> {

  let batms = await models.VendingMachine.findAll({ where: { account_id }})

  return batms

}

export async function getAccountBatm(account_id: number, batm_id: number): Promise<Batm> {

  log.logInfo('account.batms.show', { account_id, batm_id })

  let batm = await models.VendingMachine.findOne({ where: {

    id: batm_id,

    account_id

  }})

  if (!batm) {

    let error = new Error('batm for account not found')

    log.logError('account.batms.show', error)

    throw error

  }

  return batm.toJSON()

}

export async function getAccountBatmWithTransactions(account_id: number, batm_id: number) {

  let batm = await getAccountBatm(account_id, batm_id)

  let transactions = await getBatmTransactions(batm_id)

  return { batm, transactions }

}

export async function getBatmTransactions(batm_id: number): Promise<BatmTransaction[]> {

  let batm = await models.VendingMachine.findOne({ where: { id: batm_id }})

  let transactions = await query(`SELECT * FROM terminal left join transactionrecord  on (terminal.id = transactionrecord.terminal_id)  where serialnumber = '${batm.serial_number}' order by transactionrecord.terminaltime desc;`)

  return transactions
}

