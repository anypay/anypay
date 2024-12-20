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

import { promises as fs } from 'fs'
import { join } from 'path'

import { Schema } from '@hapi/joi'

import WebsocketClientSession from '@/websockets/session';

export interface WebsocketMessage {
    topic: string;
    payload: any;
}

export interface Request {
    session: WebsocketClientSession
    message: WebsocketMessage
}

export interface Handler<T> {
    (request: Request): Promise<T>;
    schema?: Schema
}

class Router {
    private handlers: Record<string, Handler<void>> = {};

    constructor({ handlersDirectory }: { handlersDirectory: string }) {
        this.handlers = {};
        this.registerHandlers(handlersDirectory);
    }

    public registerHandler(name: string, handler: Handler<void>) {
        this.handlers[name] = handler;
    }

    public getHandler(name: string) {
        return this.handlers[name];
    }

    private async registerHandlers(directory: string) {
        const files = await fs.readdir(directory);
        for (const file of files) {

            const filePath = join(directory, file);
            const stat = await fs.stat(filePath);
            if (stat.isFile() && file.endsWith('.ts')) {
                const handlerName = file.slice(0, -3); // Remove the '.js' extension
                const handlerModule = await import(filePath);

                const handler: Handler<any> = Object.assign(handlerModule.default, { schema: handlerModule.schema });
                // Assuming you have a method to register handlers in your router
                // This is pseudo-code and will depend on your specific router implementation
                this.handlers[handlerName] = handler
            }
        }
    }

    dispatch(session: WebsocketClientSession, message: WebsocketMessage) {

        const handler: Handler<any> = this.getHandler(message.topic);

        if (!handler) {
            console.error(`No handler found for topic: ${message.topic}`);
            session.closeSession(new Error(`No handler found for topic: ${message.topic}`));
        }

        if (handler.schema) {
            const { error } = handler.schema.validate(message.payload);
            if (error) {
                console.error('Failed to validate payload', error);
                session.closeSession(error);
            }
        }
        if (handler) {

            handler({
                session,
                message            
            });

        } else {
            console.error(`No handler found for topic: ${message.topic}`);
        }
    }

}

const router = new Router({
    handlersDirectory: join(__dirname, './handlers')
})

export default router