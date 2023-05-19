
import { Socket } from 'socket.io-client'

import { log } from '../log'

import { Logger } from 'winston'

export interface Context<T> {
    socket: Socket;
    message: T;
    log: Log;
}

interface Invoice {
    uid: string;
    uri?: string;
}

export class Log {
    
    log: Logger;
    socket: Socket;

    constructor({socket}: {socket: Socket}) {
        this.log = log
        this.socket = socket
    }
    info(event: string, payload?: any) {
        this.log.info(event, payload)
        this.socket.emit('log.info', { event, payload })
    }
    error(event: string, error?: Error) {
        this.log.error(event, error)
        this.socket.emit('log.error', { event, error })
    }
    debug(event: string, payload?: any) {
        this.log.debug(event, payload)
        this.socket.emit('log.debug', { event, payload })
    }
}

export const handlers = {

    listBalances(c: Context<void>) {

        c.log.debug('websocket.message.balances.list')

    },

    updateBalances(c: Context<void>) {

        c.log.debug('websocket.message.balances.update')

    },

    invoiceCreated(c: Context<Invoice>) {

        c.log.debug('websocket.message.invoice.created')

    },

    invoiceCancelled(c: Context<Invoice>) {

        c.log.debug('websocket.message.invoice.cancelled')

    },

    invoicePaid(c: Context<Invoice>) {

        c.log.debug('websocket.message.invoice.paid')

    },

    payInvoice(c: Context<Invoice>) {

        c.log.debug('websocket.message.pay.invoice')

    },

}
