require('dotenv').config()

import * as http from 'superagent'

import { v4 } from 'uuid'

import { models } from './models'

import { handleCompletedACH } from './ach'

const API_BASE = 'https://backend.mercury.com/api/v1'

export async function getAccount(id: string) {

  let response = await http.get(`${API_BASE}/account/${id}`)
    .auth(process.env['MERCURY_API_TOKEN'])

  return response.body

}

export async function listTransactions(accountId: string) {

  let response = await http.get(`${API_BASE}/account/${accountId}/transactions`)
    .auth(process.env['MERCURY_API_TOKEN'])

  return response.body

}

export async function sendACHForBatch(batchId: number) {

  console.log('send ach for batch', batchId)

  let batch = await models.AchBatch.findOne({ where: {
    id: batchId
  }})

  if (batch.status !== 'pending') {
    throw new Error('ACH Batch must be pending')
  }

  let mercuryRecipient = await models.MercuryRecipient.findOne({
    where: {
      account_id: batch.account_id
    }
  })

  if (!mercuryRecipient) {
    throw new Error('Mercury Recipient Not Found')
  }

  let externalMemo = batch.batch_description
  let amount = batch.amount

  let recipientId = mercuryRecipient.recipientId

  let transaction = await sendACH(recipientId, amount, externalMemo)

  let { ach_batch } = await handleCompletedACH(batch.id, transaction.id, transaction.estimatedDeliveryDate)

  return { ach_batch, transaction }

}

export async function sendACH(recipientId: string, amount: number, externalMemo: string) {

  let accountId = process.env['MERCURY_ACH_ACCOUNT_ID']

  let idempotencyKey = v4()

  let response = await http.post(`${API_BASE}/account/${accountId}/transactions`)
    .auth(process.env['MERCURY_API_TOKEN'])
    .send({
      paymentMethod: 'ach',
      recipientId,
      amount,
      externalMemo,
      idempotencyKey
    })

  return response.body

}

export async function listAccounts() {

  let response = await http.get(`${API_BASE}/accounts`)
    .auth(process.env['MERCURY_API_TOKEN'])

  return response.body

}

export async function listRecipients() {

  let response = await http.get(`${API_BASE}/recipients`)
    .auth(process.env['MERCURY_API_TOKEN'])

  return response.body

}

