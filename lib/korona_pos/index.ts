import { models } from '../models'
import { log } from '../logger'

import { publish } from '../amqp'

import { generateInvoice } from '../invoice'

export interface KoronaPosOrder {

}

export function demoOrder() {
  return require('./example_data.json')
}

export async function recordOrder(account_id: number, order) {


  log.info('koronapos.order', order)

  publish('koronapos.order', order)

  let amount = order.receipt.total.value

  let record = await models.KoronaPosOrder.create({
    payload: order,
    account_id
  })

  return record

}

export async function handleOrder(account_id: number, order) {

  let record = await recordOrder(account_id, order)

  let account = await models.Account.findOne({ where: { id: account_id }})

  let amount = order.receipt.total.value

  let invoice = await generateInvoice(account_id, amount, 'BCH')

  return { order: record, invoice }

}

