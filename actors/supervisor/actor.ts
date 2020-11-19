/* implements rabbi actor protocol */

require('dotenv').config();

import { startActors } from 'rabbi';

export async function start() {

  // containers1
  startActors([
    'webhooks',
    'prices',
    'payment_push_notification',
    'grab_and_go_push_notification',
    'truereviews',
    'invoice_created_to_slack'
  ])

  // containers2
  startActors([
    'payment_processor',
    'payment-options-processor',
    'invoice_paid_apply_settlement',
    'kraken-auto-sell',
    'grab_and_go_payment_amqp',
    'grab_and_go_invoice_order',
    'ambassador-rewards',
    'republish-invoice-paid-to-account-id',
    'invoice_after_create_to_energycity',
    'router_transactions'
  ])

  // containers3
  startActors([
    'cashback_customers',
    'invoice-paid-cashback-record'
  ])

}

if (require.main === module) {

  start();

}

