/* implements rabbi actor protocol */

require('dotenv').config();

import { startActors } from 'rabbi';

export async function start() {

  startActors([
    'webhooks',
    'payment_push_notification',
    'grab_and_go_push_notification',
    'invoice_created_to_slack',
    'invoice_paid_receipt_slack',
    'payment-options-processor',
    'grab_and_go_payment_amqp',
    'grab_and_go_invoice_order',
    'republish-invoice-paid-to-account-id',
    'invoice_after_create_to_energycity',
    'email-one-day-after-signup',
    'bittrex_autosell'
  ])

}

if (require.main === module) {

  start();

}

