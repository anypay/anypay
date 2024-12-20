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

const PaymentConfirmedEvent = z.object({
    topic: z.string().regex(/payment.confirmed/),
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
        status: z.string().regex(/confirmed/)
      }),
      confirmation: z.object({
        hash: z.string(),
        height: z.number()
      })
    })
  })
  
  type PaymentConfirmedEvent = z.infer<typeof PaymentConfirmedEvent>

  export default PaymentConfirmedEvent

  export async function build(params: {
    invoice_uid: string
  }): Promise<PaymentConfirmedEvent> {

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

    if (invoice.uid !== params.invoice_uid) {
        throw new Error('Invoice not found')
    }

    if (payment.invoice_uid !== params.invoice_uid) {
        throw new Error('Payment not found')
    }

    const event: PaymentConfirmedEvent = {
        topic: 'payment.confirmed',
        payload: {

            invoice: {
                uid: invoice.uid,
                status: 'paid'
            },
            payment: {
                chain: String(payment.chain),
                currency: payment.currency,
                txid: payment.txid,
                status: 'confirmed'
            },
            confirmation: {
                hash: String(payment.confirmation_hash),
                height: Number(payment.confirmation_height)
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
  