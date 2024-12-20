
import AuthenticatedRequest from "@/server/auth/AuthenticatedRequest"
import { log } from "@/lib"

import { publish } from '@/lib/amqp'

import { confirmTransactionsFromBlockWebhook } from "@/lib/blockcypher"
import { Request, ResponseToolkit } from "@hapi/hapi"

export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

    const webhook = request.payload as {
        event: string
        address: string
        url: string
        confirmations: number
        satoshis: number
        hash: string
        block_height: number
        total: number
        fees: number
        received: string
        confirmed: string
        inputs: any[]
        outputs: any[]
        double_spend: boolean
        data: any
    }

    try {

        log.info('blockcypher.webhook.received', webhook)

        publish('blockcypher.webhook.received', webhook)

        confirmTransactionsFromBlockWebhook(webhook)

        return { success: true }

    } catch (err) {

        return { success: false }

    }

}
