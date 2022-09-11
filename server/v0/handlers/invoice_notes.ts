
import { ResponseToolkit } from 'hapi';
import { models } from '../../../lib';

export async function create(req, h: ResponseToolkit) {

  let invoice = await models.Invoice.findOne({

    where: {

      uid: req.params.invoice_uid,
      account_id: req.account.id

    }
  })

  if (!invoice) { throw new Error('invoice not found') }

  let note = await models.InvoiceNote.create({
    invoice_uid: invoice.uid,
    content: req.payload.note
  });

  return {

    note

  }

}
