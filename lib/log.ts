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

import { publish } from 'rabbi'

import { asBoolean, config } from './config'

import { events as Event } from '@prisma/client'

interface NewLogger {
  namespace?: string;
  env?: string; 
}

interface LogQuery {
  type?: string;
  payload?: any;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  error?: boolean;
}

import * as winston from 'winston';
import prisma from './prisma';

const transports = [
  new winston.transports.Console({ level: 'debug' })
]

if (asBoolean('LOKI_ENABLED') && asBoolean('LOKI_HOST')) {

  const LokiTransport = require("winston-loki");

  const lokiConfig: {
    format: any;
    host: string;
    json: boolean;
    batching: boolean;
    labels: any;
    basicAuth?: string;
  
  } = {
    format: winston.format.json(),
    host: config.get('LOKI_HOST'),
    json: true,
    batching: false,
    labels: { app: config.get('LOKI_LABEL_APP') }
  }

  if (config.get('LOKI_BASIC_AUTH')) {

    lokiConfig['basicAuth'] = config.get('LOKI_BASIC_AUTH')
  }

  transports.push(
    new LokiTransport(lokiConfig)
  )

}

const winstonLogger = winston.createLogger({
  level: 'info',
  transports,
  format: winston.format.json()
});

export class Logger {

  namespace: string;

  log: winston.Logger;

  env: string;

  constructor(params: NewLogger = {namespace: 'anypay'}) {

    this.log = winstonLogger

    this.namespace = params.namespace || 'anypay'

    this.env = String(params.env || config.get('NODE_ENV'))

  }

  async info(topic: string, payload: any = {}) {
    
    if (typeof payload.toJSON === 'function') {

      payload = payload.toJSON()

    }

    if (this.env !== 'test') {

      this.log.info(topic, payload)
    }
      
    const record = await prisma.events.create({
      data: {
        namespace: this.namespace,
        type: topic,
        payload,
        error: false,
        account_id: payload.account_id,
        invoice_uid: payload.invoice_uid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    publish('events.created', record);

    await publish(topic, {topic, payload})

    // Allows for account-specific consumers to receive all related events
    // or only events for a particular topic based on the routing key
    if (payload.account_id) {

      const routing_key = `accounts.${payload.account_id}.events`

      await publish(routing_key, {topic, payload})
      await publish(`${routing_key}.${topic}`, {topic, payload})

    }

    // Allows for app-specific consumers to receive all related events
    // or only events for a particular topic based on the routing key
    if (payload.app_id) {

      const routing_key = `apps.${payload.app_id}.events`

      await publish(routing_key, {topic, payload})
      await publish(`${routing_key}.${topic}`, {topic, payload})

    }

    // Allows for invoice-specific consumers to receive all related events
    // or only events for a particular topic based on the routing key
    if (payload.invoice_uid) {

      const routing_key = `invoices.${payload.invoice_uid}.events`

      await publish(routing_key, {topic, payload})
      await publish(`${routing_key}.${topic}`, {topic, payload})

    }
    return record

  }

  async error(error_type: string, error: Error): Promise<Event> {

    this.log.error(error_type, error.message)

    console.error(error_type, error.message)

    const record = await prisma.events.create({
      data: {
        namespace: this.namespace,
        type: error_type,
        payload: { error: error.message },
        error: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return record;

  }

  async debug(type: string, payload:any={}) {

    this.log.debug(type, payload)

  }

  async read(query: LogQuery = {}): Promise<Event[]> {

    this.log.debug('log.read', query)

    const where: {
      namespace: string;
      error: boolean;
      type?: string;
      payload?: any;
    
    } = {
      namespace: this.namespace,
      error: query.error || false
    }

    if (query.type) { where['type'] = query.type }

    if (query.payload) { where['payload'] = query.payload }

    const records = await prisma.events.findMany({
      where,
      take: query.limit || 100,
      skip: query.offset || 0,
      orderBy: {
        createdAt: query.order || 'asc'
      }
    })

    return records;

  }

}

const log = new Logger({ namespace: 'anypay' })

export { log }
