
import * as Joi from 'joi'

import { Socket } from 'socket.io'

import { log } from '../../../../lib/log'

const schema = {

    setAddress: Joi.object({
        currency: Joi.string().required(),
        value: Joi.string().required()
    }),

    setBalance: Joi.object({
        currency: Joi.string().required(),
        address: Joi.string().required(),
        value: Joi.string().required(),
        usd_value: Joi.string().required()
    })
}

interface SetAddress {
    currency: string;
    value: string;
}

export async function setAddress(socket: Socket, params: SetAddress): Promise<void> {

    const { error } = schema.setAddress.validate(params)

    if (error) {

        log.error('wallet-bot.socket.io.handlers.addresses.setAddress', error)

        return emitError(socket, error)
    
    }

}

interface SetBalance {
    currency: string;
    address: string;
    value: number;
    usd_value: number;
}

export async function setBalance(socket: Socket, params: SetBalance): Promise<void> {

    const { error } = schema.setBalance.validate(params)

    if (error) {

        log.error('wallet-bot.socket.io.handlers.addresses.setBalance', error)

        return emitError(socket, error)
    
    }

}

function emitError(socket: Socket, error: Error): void {
    socket.emit('error', {
        statusCode: 400,
        name: 'BadRequest',
        message: error.message,
        error
    })
}