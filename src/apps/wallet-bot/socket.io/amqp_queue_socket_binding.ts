
import { awaitChannel, channel } from '../../../lib/amqp'

import { WebSocket } from 'ws'

import { log } from '../../../lib/log'

import * as uuid from 'uuid';

import { ConsumeMessage } from 'amqplib'

import { WalletBots as WalletBot } from '@prisma/client'

export interface Context {

    socket: WebSocket;

    walletBot: WalletBot;

    consumerTag?: string;

}

export async function bind(context: Context): Promise<Context> {

    const consumerTag = uuid.v4()

    context.consumerTag = consumerTag

    const queue = `wallet-bot.${context.walletBot.id}.events`

    const exchange = 'wallet-bot'

    await awaitChannel();

    await channel.assertQueue(queue, {

        durable: false,

        autoDelete: true,

    })


        channel.bindQueue(queue, exchange, queue)

        channel.consume(queue, async (msg: ConsumeMessage | null) => {

            if (!msg) return;

            try {

                const message = JSON.parse(msg.content.toString())

                const { type, payload } = message

                if (type && payload) {

                    context.socket.emit(type, payload)

                }

            } catch (error: any) {

                log.error('wallet-bot.socket.io', error)

            }

            channel.ack(msg);

        }, {
            consumerTag
        })


    return context

}

export function unbind(context: Context) {

    if (context.walletBot) {
            
        const queue = `wallet-bot.${context.walletBot.id}.events`

        const exchange = 'wallet-bot'
    
        channel.unbindQueue(queue, exchange, queue)

    }

    if (context.consumerTag) {

        channel.cancel(context.consumerTag);

    }

}
