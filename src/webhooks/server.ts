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

/* Actor that listens for system events and generates, sends
 * corresponding webhooks to the configured webhook URL
 *  
 * Webhooks may be configured on three leves:
 * 
 * - invoice
 * - account
 * - app 
 * 
 * Invoice webhooks are generated via the API an a per-invoice basis when you
 * create an invoice. Account and app webhooks are setup via the API in advance
 * and then are automatically applied to all invoices created for the account
 * or app.
*/

import { Channel, Connection, Message, connect } from 'amqplib'
import { Actor } from 'rabbi'
import { WebhookBuilder } from './builder'
import { Logger } from '../../lib/log'
import winston = require('winston')
import { PrismaClient } from '@prisma/client'

interface WebhookServerOptions {
    amqp: {
        url: string
        exchange: string
    },
    log: Logger
    prisma: PrismaClient
}

interface WebhookServerProps extends WebhookServerOptions {

}

interface WebhookHandlerActors {
    [topic: string]: Actor
}

type Topic =
  'invoice.created'    |
  'invoice.paid'       |
  'invoice.cancelled'  |
  'payment.confirming' |
  'payment.confirmed'  |
  'payment.failed'


export class WebhookServer {
    props: WebhookServerProps
    amqp_connection?: Connection
    amqp_channel?: Channel
    private actors: WebhookHandlerActors
    topics: Topic[]
    log: Logger | winston.Logger
    prisma: PrismaClient

    constructor(options: WebhookServerOptions) {
        this.props = options
        this.actors = {}
        this.topics = [
            'invoice.created',
            'invoice.paid',
            'invoice.cancelled',
            'payment.confirming',
            'payment.confirmed',
            'payment.failed'
        ]
        this.log = options.log
        this.prisma = options.prisma
    }

    async start() {
        this.log.info('webhooks.server.start', {
            topics: this.topics,
            amqp: this.props.amqp
        })
        this.amqp_connection = await connect(this.props.amqp.url)
        this.log.info('webhooks.server.amqp.connected')
        this.amqp_channel = await this.amqp_connection.createChannel()
        this.log.info('webhooks.server.amqp.channel.created')

        this.topics.forEach(topic => {

            const actor = new Actor({
                exchange: this.props.amqp.exchange,
                routingkey: topic,
                queue: `webhooks.${topic}`,
            })

            this.actors[topic] = actor

            actor.start(async (channel: Channel, msg: Message, json: any) => {

                try {

                    const { topic, payload } = json as {
                        topic: string,
                        payload: any
                    }

                    let invoice_uid;

                    if (payload?.invoice?.uid) {

                        invoice_uid = payload.invoice.uid

                    } else if (payload?.invoice?.uid) {

                        invoice_uid = payload.invoice.uid

                    } else {

                        throw new Error('no invoice_uid')
                    }

                    let invoice = await this.prisma.invoices.findFirstOrThrow({
                        where: { uid: invoice_uid}
                    })

                    const webhook = new WebhookBuilder({
                        topic,
                        params: {
                            invoice_uid,
                        }
                    })

                    const webhookPayload = await webhook.buildPayload()

                    console.log(JSON.stringify(webhookPayload, null, 2))

                    if (invoice.webhook_url) {

                        await webhook.sendWebhook({
                            url: invoice.webhook_url
                        })

                    }

                } catch(error) {

                    const { message } = error as Error

                    console.error('Error processing webhook', message)
                }
     
            })
        })
        
    }

    async stop() {
        Object.values(this.actors).forEach(actor => {
            actor.stop()
        })
        await this.amqp_channel?.close()
        await this.amqp_connection?.close()
    }
} 