/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import {
  invoices as Invoice,
  accounts as Account,
  events as Event
} from '@prisma/client'

import { events } from 'rabbi'

import { log } from './log';

import { publish } from 'rabbi'
import prisma from './prisma';

interface EventData {
  type: string;
  payload: any;
  account_id?: number;
  app_id?: number;
}

export async function record(data: EventData): Promise<Event> {

  return prisma.events.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      account_id: 1,
    },

  })

}

export async function recordEvent(payload: any, type: string): Promise<Event> {

  return prisma.events.create({
    data: {
      type,
      payload,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

}

export async function listEvents(type: string, payload: any): Promise<Event[]> {

  return prisma.events.findMany({
    where: {
      type,
      payload
    }
  })


}

export async function listInvoiceEvents(invoice: Invoice, type?: string): Promise<Event[]> {

  var where: {
    invoice_uid: string;
    type?: string;
  
  } = {

    invoice_uid: invoice.uid

  }

  if (type) {

    where['type'] = type

  }

  return prisma.events.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    }
  })


}

interface EventLogOptions {
  type?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function listAccountEvents(account: Account, options: EventLogOptions={}): Promise<Event[]> {

  var query: any = {

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

  return prisma.events.findMany({
    where: query.where,
    orderBy: {
      createdAt: options.order || 'desc'
    },
    take: query.limit,
    skip: query.offset
  })

}

export async function republishEventToRoutingKeys(event: Event): Promise<void> {

  if (event.account_id) {

    const key = `accounts.${event.account_id}.events`

    publish(key, event)

  }

  if (event.app_id) {

    publish(`apps.${event.app_id}.events`, event)

  }

  if (event.invoice_uid) {

    publish(`invoices.${event.invoice_uid}.events`, event)

  }

}


export { events }

