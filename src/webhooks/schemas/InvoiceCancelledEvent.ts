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

const InvoiceCancelledEvent = z.object({
    topic: z.string().regex(/invoice.created/),
    payload: z.object({
      account_id: z.number().optional(),
      app_id: z.number().optional(),
      invoice: z.object({
        uid: z.string(),
        status: z.string().regex(/cancelled/),
      })
    })
  })
  
type InvoiceCancelledEvent = z.infer<typeof InvoiceCancelledEvent>

export default InvoiceCancelledEvent

export async function build({invoice_uid}: {invoice_uid: string}): Promise<InvoiceCancelledEvent> {

    const invoice = await prisma.invoices.findFirstOrThrow({
        where: {
            uid: invoice_uid
        }
    })

    if (invoice.status !== 'cancelled') {
        throw new Error('invoice is not cancelled')
    }

    const event: InvoiceCancelledEvent = {
        topic: 'invoice.cancelled',
        payload: {
            invoice: {
                uid: invoice_uid,
                status: 'cancelled'
            }
        }
    }

    if (invoice.account_id) {
        event.payload.account_id = invoice.account_id
    }
    if (invoice.app_id) {
        event.payload.app_id = invoice.app_id
    }

    return event;

}