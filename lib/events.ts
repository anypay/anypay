require('dotenv').config();

import {connect} from 'amqplib';

import {log} from './log';

import {models} from './models';

import { Orm } from './orm'

import { Invoice } from './invoices'

import { Account } from './account'

import { events } from 'rabbi'

import { Op } from 'sequelize'

interface EventData {
  type: string;
  payload: any;
  account_id?: number;
}

export async function record(data: EventData) {

  return models.Event.create(data);

}

export async function recordEvent(payload: any, type: string): Promise<Event> {

  let record = await models.Event.create({ payload, type });

  return new Event(record)

}

export class Event extends Orm {

  get(key) {

    let value = this.record.dataValues[key]

    if (value) return value

    return this.record.dataValues.payload[key]

  }

  toJSON() {

    let json = this.record.toJSON()

    return json

  }

}

export async function listEvents(type: string, payload: any): Promise<Event[]> {

  let records = await models.Event.findAll({

    where: {

      type,

      payload

    }

  })

  return records.map(record => new Event(record))

}

export async function listInvoiceEvents(invoice: Invoice, type?: string): Promise<Event[]> {

  var where = {

    invoice_uid: invoice.uid

  }

  if (type) {

    where['type'] = type

  }

  let records = await models.Event.findAll({ where })

  return records.map(record => new Event(record))

}

interface EventLogOptions {
  type?: string;
  order?: string;
}

export async function listAccountEvents(account: Account, options: EventLogOptions={}): Promise<Event[]> {

  var query = {

    where: {

      account_id: account.id

    },

    order: [['createdAt', 'desc']]

  }

  if (options.type) {

    query.where['type'] = options.type

  }

  if (options.order) {

    query.order = [['createdAt', options.order]]

  }

  let records = await models.Event.findAll(query)

  return records.map(record => new Event(record))

}

export { events }

