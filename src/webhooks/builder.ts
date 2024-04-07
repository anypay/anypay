#!/usr/bin/env ts-node
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

import { Webhooks as Webhook } from '@prisma/client'

import axios from 'axios'

export class WebhookBuilder {

  record: Webhook | undefined;
  topic: string;
  params: any;

  constructor({
    topic,
    params
  }: {
    topic: string,
    params: any
  }) {

    this.topic = topic
    this.params = params

  }

  async buildPayload(): Promise<any> {

    let builderFunction = builderFunctions[this.topic]

    if (!builderFunction) {
      throw new Error(`No builder function for topic: ${this.topic}`)
    }

    let payload = await builderFunction(this.params)

    return payload;

  }

  async sendWebhook({ url }: { url: string }): Promise<void> {

    const payload = await this.buildPayload()

    try {

      const result = await axios.post(url, payload)

      if (result.status !== 200) {
        throw new Error(`Unexpected status code: ${result.status}`)
      }

    } catch(error) {
      
      const { message } = error as Error

      console.error('sendWebhook.error', error)

      throw new Error(`Failed to send webhook: ${message}`)

    }

  }
}

interface BuilderFunctions {
    [key: string]: (params: any) => Promise<any>
}

import { build as buildInvoiceCreatedEvent } from './schemas/InvoiceCreatedEvent'
import { build as buildInvoiceCancelled }    from './schemas/InvoiceCancelledEvent'
import { build as buildInvoicePaid }         from './schemas/InvoicePaidEvent'
import { build as buildPaymentConfirming }   from './schemas/PaymentConfirmingEvent'
import { build as buildPaymentConfirmed }    from './schemas/PaymentConfirmedEvent'
import { build as buildPaymentFailed }       from './schemas/PaymentFailedEvent'

const builderFunctions: BuilderFunctions = {
    'invoice.created': buildInvoiceCreatedEvent,
    'invoice.paid': buildInvoicePaid,
    'invoice.cancelled': buildInvoiceCancelled,
    'payment.confirming': buildPaymentConfirming,
    'payment.confirmed': buildPaymentConfirmed,
    'payment.failed': buildPaymentFailed
}