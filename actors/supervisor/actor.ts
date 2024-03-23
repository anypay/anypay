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

  startActors([
    'webhooks',
    'webhooks-events',
    'paid_webhooks',
    'payment_push_notification',
    'grab_and_go_push_notification',
    'invoice_created_to_slack',
    'invoice_paid_receipt_slack',
    'payment-options-processor',
    'grab_and_go_payment_amqp',
    'republish-invoice-paid-to-account-id',
    'invoice_after_create_to_energycity',
    'email-one-day-after-signup',
    'account_created_email',
    'first_address_set_email',
    'invoice_paid_receipt_email',
    'refunds'
  ])

}

if (require.main === module) {

  start();

}

