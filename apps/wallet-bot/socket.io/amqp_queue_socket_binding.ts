
import { awaitChannel, channel } from '../../../lib/amqp'

import { Socket } from 'socket.io'

import { log } from '../../../lib/log'

import * as uuid from 'uuid';

import { WalletBot } from '..';

export interface Context {

    socket: Socket;

    walletBot?: WalletBot;

    consumerTag?: string;

}

export async function bind(context: Context): Promise<Context> {

    context.walletBot = context.socket.data.walletBot;

    const consumerTag = uuid.v4()

    context.consumerTag = consumerTag

    const queue = `wallet-bot.${context.walletBot.get('id')}.events`

    const exchange = 'wallet-bot'

    await awaitChannel();

    await channel.assertQueue(queue, {

        durable: false,

        autoDelete: true,

    })


        channel.bindQueue(queue, exchange, queue)

        channel.consume(queue, async (msg) => {

            try {

                const message = JSON.parse(msg.content.toString())

                console.log('MESSAGE', message)

                const { type, payload } = message

                if (type && payload) {

                    console.log('EMIT', { type, payload })

                    context.socket.emit(type, payload)

                }

            } catch (error) {

                log.error('wallet-bot.socket.io', error)

            }

            channel.ack(msg);

        }, {
            consumerTag
        })


    return context

}

export function unbind(context: Context) {

    const queue = `wallet-bot.${context.walletBot.get('id')}.events`

    const exchange = 'wallet-bot'

    channel.cancel(context.consumerTag);

    channel.unbindQueue(queue, exchange, queue)

}
