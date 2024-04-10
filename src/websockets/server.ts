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

import * as WebSocket from 'ws';
import { connect, Connection } from 'amqplib';
import { log } from '../../lib'; 
import WebsocketClientSession from './session';
import { Server } from 'http'
import * as Hapi from '@hapi/hapi';
import { Logger } from '../../lib/log'
import { Request } from 'express'

const RABBITMQ_URL = 'amqp://localhost'; // RabbitMQ connection URL

export interface AnypayWebsocketServerParams {
    listener: Server
    amqp: {
        url: string
        exchange: string
    }
    log: Logger
}

export class AnypayWebsocketServer {

    private wsServer: WebSocket.Server;
    private props: AnypayWebsocketServerParams;

    constructor(params: AnypayWebsocketServerParams) {
        this.wsServer = new WebSocket.Server({
            server: params.listener
        });
        this.props = params
    }

    async start() {

        let rabbitConnection: Connection;
        try {
            rabbitConnection = await connect(this.props.amqp.url);
        } catch (error) {
            console.error('Failed to connect to RabbitMQ', error);
            process.exit(1);
        }

        const channel = await rabbitConnection.createChannel();

        await channel.assertExchange(this.props.amqp.exchange, 'direct', { durable: true });

        this.wsServer.on('connection', async (websocket: WebSocket, request: Request) => {

            try {

                const channel = await connect(this.props.amqp.url).then(conn => conn.createChannel());

                const session = new WebsocketClientSession({
                    websocket,
                    amqp: {
                        channel,
                        exchange: this.props.amqp.exchange
                    },
                    log: this.props.log
                });

                await session.authenticate({ request })

                this.props.log.info('websocket.client.connected', { uid: session.uid });

            } catch(error) {
                
                this.props.log.error('websocket.client.error',  error as Error);

                websocket.close(1008, 'Internal Server Error');
                
                return;
            }


        });

    }

    async stop() {
    
        this.wsServer.close();

    }

}

export async function buildServer({ listener }: { listener: Server }): Promise<AnypayWebsocketServer> {

    return new AnypayWebsocketServer({
        listener,
        amqp: {
            url: process.env.ANYPAY_AMQP_URL || RABBITMQ_URL,
            exchange: process.env.ANYPAY_AMQP_EXCHANGE || 'anypay'
        },
        log
    });

};

export async function startServer({ port, host }: {
    port: number,
    host: string
}): Promise<AnypayWebsocketServer> {

    const server = Hapi.server({
        port,
        host
    });

    const wsServer: AnypayWebsocketServer = await buildServer({ listener: server.listener });
    
    wsServer.start()
    
    await server.start()

    log.info('websockets.server.started', server.info)

    return wsServer;
}

if (require.main === module) {

    const port = process.env.ANYPAY_WEBSOCKETS_PORT ?
        Number(process.env.ANYPAY_WEBSOCKETS_PORT) : 5202

    startServer({
        port,
        host: process.env.ANYPAY_WEBSOCKETS_HOST || '0.0.0.0'
    });

}