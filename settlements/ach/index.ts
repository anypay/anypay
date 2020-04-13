import { models } from '../../lib';

export async function apply(invoice) {

  // get latest ach batch
  let ach_batch = await getCurrentActiveBatch(invoice.account_id)

  invoice.ach_batch_id = ach_batch.id;

  await invoice.save();

  return invoice;

}

async function getCurrentActiveBatch(account_id) {

  let batch = await models.AchBatch.findOrCreate({
    where: {
      account_id,
      status: 'active'
    },

    defaults: {
      account_id,
      status: 'active'
    }
  });

  return batch;

}
