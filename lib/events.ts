
import {models} from './models';

import { findAll, Orm } from './orm'

import { Invoice } from './invoices'

import { Account } from './account'

import { events } from 'rabbi'
import { log } from './log';

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

  static model = models.Event;

}

export async function listEvents(type: string, payload: any): Promise<Event[]> {

  let records = await findAll<Event>(Event, {

    where: {

      type,

      payload

    }

  })

  return records

}

export async function listInvoiceEvents(invoice: Invoice, type?: string): Promise<Event[]> {

  var where = {

    invoice_uid: invoice.uid

  }

  if (type) {

    where['type'] = type

  }

  let records = await findAll<Event>(Event, { where, order: [['createdAt', 'desc']] })

  return records;

}

interface EventLogOptions {
  type?: string;
  order?: string;
  limit?: number;
  offset?: number;
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

  query['limit'] = options.limit || 100;

  query['offset'] = options.offset || 0;

  log.info('events.listAccountEvents', { query })

  return findAll<Event>(Event, query)

}

export { events }

