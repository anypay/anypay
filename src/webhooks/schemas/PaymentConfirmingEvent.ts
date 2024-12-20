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

import { z } from 'zod'
import prisma from '@/lib/prisma'

const PaymentConfirmingEvent = z.object({
    topic: z.string().regex(/payment.confirming/),
    payload: z.object({
        account_id: z.number().optional(),
        app_id: z.number().optional(),
        invoice: z.object({
            uid: z.string(),
            status: z.string().regex(/confirming/)
        }),
        payment: z.object({
            chain: z.string(),
            currency: z.string(),
            txid: z.string(),
            status: z.string().regex(/confirming/)
        })
    })
})

type PaymentConfirmingEvent = z.infer<typeof PaymentConfirmingEvent>

export default PaymentConfirmingEvent

export async function build(params: {
    invoice_uid: string
}): Promise<PaymentConfirmingEvent> {

    const { invoice_uid } = params

    const payment = await prisma.payments.findFirstOrThrow({
        where: {
            invoice_uid: invoice_uid
        }
    })

    const invoice = await prisma.invoices.findFirstOrThrow({
        where: {
            uid: invoice_uid
        }
    })

    if (payment.status !== 'confirming') {
        throw new Error('Payment is not confirming')
    }

    const event: PaymentConfirmingEvent = {
        topic: 'payment.confirming',
        payload: {
            invoice: {
                uid: invoice_uid,
                status: invoice.status
            },
            payment: {
                status: payment.status,
                chain: String(payment.chain),
                currency: String(payment.currency),
                txid: String(payment.txid)
            }
        }
    }

    if (payment.account_id) {
        event.payload.account_id = payment.account_id
    }

    if (invoice.app_id) {
        event.payload.app_id = invoice.app_id
    }

    return event
}