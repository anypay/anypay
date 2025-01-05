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

import { WebSocket } from 'ws'
import { Channel } from 'amqplib'
import { v4 as uuid } from 'uuid';
import { exchange } from '@/lib/amqp';
import { Logger } from '@/lib/log';
import { Request } from 'express';
import prisma from '@/lib/prisma';
import { validate } from '@/lib/webhooks';

interface WebsocketClientSessionProps {
    amqp: {
        channel: Channel
        exchange: string
    }
    websocket: WebSocket
    log: Logger
}

export default class WebsocketClientSession {
 
    private readonly log: Logger
    private readonly amqp: {
        channel: Channel
        exchange: string
    }
    readonly websocket: WebSocket
    readonly uid: string
    readonly queue_name: string
    account_id?: number;
    app_id?: number;

    constructor({ websocket, amqp, log }: WebsocketClientSessionProps) {
        this.uid = uuid();
        this.queue_name = `websocket:${this.uid}`;
        this.websocket = websocket;
        this.amqp = amqp;
        this.log = log;
        websocket.on('message', this.onMessage.bind(this));
        websocket.on('close', this.onClose.bind(this));
        this.onOpen();
    }

    async authenticate({ request }: { request: Request }): Promise<{ account_id: number, app_id: number | null } | undefined> {
        let token: string | undefined;

        // Check Authorization header
        const [bearer, headerToken] = request.headers.authorization?.split(' ') || [];
        if (bearer === 'Bearer') {
            token = headerToken;
        }

        // Check query parameter if no valid header token
        if (!token) {
            const url = new URL(request.url, `http://${request.headers.host}`);
            token = url.searchParams.get('token') || undefined;
        }

        if (!token) {
            this.closeSession(new Error('no valid token provided'));
            return;
        }

        const accessToken = await prisma.access_tokens.findFirstOrThrow({
            where: {
                uid: String(token)
            }
        });

        const account = await prisma.accounts.findFirstOrThrow({
            where: {
                id: accessToken.account_id
            }   
        });

        if (accessToken.app_id) {
            const app = await prisma.apps.findFirstOrThrow({
                where: {
                    id: accessToken.app_id
                }   
            });

            this.app_id = app.id;
            this.subscribeToAppEvents();
        }

        this.account_id = account.id;
        this.subscribeToAccountEvents();

        return {
            account_id: account.id,
            app_id: accessToken.app_id
        }
    }

    private subscribeToAccountEvents() {

        console.log('subscribing to account events', this.account_id)

        if (this.account_id) {
            const routingKey = `accounts.${this.account_id}.events`;
            this.bindWebsocketToTopic(routingKey);
        }
    }

    private subscribeToAppEvents() {

        console.log('subscribing to app events', this.app_id)

        if (this.app_id) {
            const routingKey = `apps.${this.app_id}.events`;
            this.bindWebsocketToTopic(routingKey);
        }
    }


    private onMessage(message: string) {
        try {
            const { topic, payload } = JSON.parse(message.toString());

            this.onJsonReceived({ topic, payload });

        } catch (error) {
            this.log.error('websockets.onMessage.parse.error', error as Error);
            this.closeSession(new Error('failed to parse json message'));
        }

    }

    private onJsonReceived({topic, payload }: {topic: string, payload: any}) {

        // NO-OP

    }

    private async onOpen() {

        try {
            this.websocket.send(JSON.stringify({
                topic: 'websocket.connected',
                payload: {
                    uid: this.uid
                }
            
            }))
            await this.amqp.channel.assertQueue(this.queue_name, { durable: false, autoDelete: true });
            await this.amqp.channel.consume(this.queue_name, (msg) => {
                if (msg !== null) {

                    try {

                        const json = JSON.parse(msg.content.toString())

                        const { topic, payload } = json as {
                            topic: string
                            payload: any                        
                        };

                        if (validate({ topic, payload })) {

                            this.websocket.send(JSON.stringify({ topic, payload }));

                        };

                    } catch(error) {

                        console.error(error)

                    }
 
                    this.amqp.channel?.ack(msg);
                }
            });
        } catch (error) {
            this.log.error('websockets.onOpen.error', error as Error)
        }
    }

    async bindWebsocketToTopic(topic: string) {
        await this.amqp.channel.bindQueue(this.queue_name, exchange, topic);
    }

    private onClose() {
            this.log.info(`websocket.client.disconnected`, { uid: this.uid });
            if (this.amqp.channel) {
                this.amqp.channel?.close().then(() => {

                    this.log.info('websockets.channel.closed', { uid: this.uid })

                }).catch(error => {
                    this.log.error('websockets.channel.close.error', error)
                });
            }
    }

    async closeSession(error?: Error) {
        if (error) {
            this.websocket.send(JSON.stringify({ topic: 'error', payload: error.message }));
        }
        this.websocket.close();
    }

    async sendMessage(topic: string, payload: any) {
        this.websocket.send(JSON.stringify({ topic, payload }));
    }

}