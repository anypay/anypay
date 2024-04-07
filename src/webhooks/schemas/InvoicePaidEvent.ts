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
import prisma from '../../../lib/prisma'

const InvoicePaidEvent = z.object({
    topic: z.string().regex(/invoice.paid/),
    payload: z.object({
      account_id: z.number().optional(),
      app_id: z.number().optional(),
      invoice: z.object({
        uid: z.string(),
        status: z.string().regex(/paid/),
      }),
      payment: z.object({
        chain: z.string(),
        currency: z.string(),
        txid: z.string(),
        status: z.string()
      })
    })
  })
  
type InvoicePaidEvent = z.infer<typeof InvoicePaidEvent>

export default InvoicePaidEvent

export async function build(params: {
    invoice_uid: string
}): Promise<InvoicePaidEvent> {
    const invoice = await prisma.invoices.findFirstOrThrow({
        where: {
            uid: params.invoice_uid
        }
    })

    if (invoice.status !== 'paid') {
        throw new Error('Invoice is not paid')
    }

    const payment = await prisma.payments.findFirstOrThrow({
        where: {
            invoice_uid: String(invoice.uid)
        }
    })

    if (!payment) {
        throw new Error('Payment not found')
    }

    const event: InvoicePaidEvent = {
        topic: 'invoice.paid',
        payload: {
            invoice: {
                uid: params.invoice_uid,
                status: invoice.status,
            },
            payment: {
                chain: String(payment.chain),
                currency: payment.currency,
                txid: payment.txid,
                status: String(payment.status)
            }
        }
    }

    if (invoice.account_id) {
        event.payload.account_id = invoice.account_id
    }
    if (invoice.app_id) {
        event.payload.app_id = invoice.app_id
    }

    return event
}
