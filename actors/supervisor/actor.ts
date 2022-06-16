/* implements rabbi actor protocol */

require('dotenv').config();

import { startActors } from 'rabbi';

export async function start() {

  startActors([
    'webhooks',
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

