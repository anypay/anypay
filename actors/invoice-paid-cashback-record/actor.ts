
import { models } from '../../lib';
import { Actor } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'create_customer_cashback_record_from_invoice'

  })
  .start(async (channel, msg, invoice) => {

    let merchant = await models.CashbackMerchant.findOne({

      where: {
      
        account_id: invoice.account_id
      }

    });

    if (!merchant) {
      throw new Error(`cashback merchant not found`);
    }

    let existingRecord = await models.CashbackCustomerPayment.findOne({
      where: { invoice_id: invoice.id }
    });

    if (existingRecord) {
      throw new Error(`cashback record already exists for invoice ${invoice.id}`)
    }

    let cashBackCustomerPayment = await models.CashbackCustomerPayment.create({
      currency: invoice.currency,
      cashback_merchant_id: merchant.id,
      invoice_id: invoice.id
    });



    await channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

