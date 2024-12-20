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

/* implements rabbi actor protocol */

require('dotenv').config();

import { startActors } from 'rabbi';

export async function start() {
  

  //@ts-ignore
  startActors([
    //@ts-ignore
    'webhooks',
    //@ts-ignore
    'webhooks-events',
    //@ts-ignore
    'paid_webhooks',
    //@ts-ignore
    'payment_push_notification',
    //@ts-ignore
    'grab_and_go_push_notification',
    //@ts-ignore
    'invoice_created_to_slack',
    //@ts-ignore
    'invoice_paid_receipt_slack',
    //@ts-ignore
    'payment-options-processor',
    //@ts-ignore
    'grab_and_go_payment_amqp',
    //@ts-ignore
    'republish-invoice-paid-to-account-id',
    //@ts-ignore
    'invoice_after_create_to_energycity',
    //@ts-ignore
    'email-one-day-after-signup',
    //@ts-ignore
    'account_created_email',
    //@ts-ignore
    'first_address_set_email',
    //@ts-ignore
    'invoice_paid_receipt_email',
    //@ts-ignore
    'refunds'
  ])

}

if (require.main === module) {

  start();

}

