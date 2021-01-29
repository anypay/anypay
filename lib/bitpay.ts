
import { models } from './models';
import * as http from 'superagent';

export async function create(invoice_uid: string) {

  let uid = invoice_uid;

  let invoice = await models.Invoice.findOne({ where: { uid }});

  if (!invoice) {
    throw new Error('invoice not found');
  }

  let [settlement, isNew] = await models.BitpaySettlement.findOrCreate({
    where: {
      invoice_uid: invoice.uid
    },

    defaults: {
      invoice_uid: invoice.uid
    }
  })

  if (!isNew) {
    console.log('settlement already created for invoice');
  } else {
    invoice.settlement_id = settlement.id;
    await invoice.save();
  }

  if (settlement.txid) {
    throw new Error('invoice already settled');
  }

  let bitpayInvoice = await generateInvoice(
    invoice.denomination_amount_paid,
    `anypay:${invoice.uid}|egifter:${invoice.external_id}`
  );

  settlement.url = bitpayInvoice.url;

  await settlement.save();

  return settlement;
}

interface SettlementUpdate {
  invoice_uid: string;
  txid: string;
  amount: number;
  currency:string;
}

export async function update(params: SettlementUpdate){
  console.log('bitpay.settlement.update', params);
 
  let settlement = await models.BitpaySettlement.findOne({ where: {
    invoice_uid: params.invoice_uid
  }});

  settlement.txid = params.txid;
  settlement.amount = params.amount;
  settlement.currency = params.currency;

  await settlement.save();

  return settlement;

}

async function generateInvoice(amount, uid="12345") {

  let resp = await http
    .post('https://crypto-invoice-generator.egifter.com/v1/Bitpay')
    .set('Content-Type', 'application/json')
    .send({
      "amount": parseFloat(amount),
      "description": "anypay settlement",
      "orderId": uid,
      "email": "dashsupport@egifter.com"
    })

  return resp.body;

}

