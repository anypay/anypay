
import { models } from './models'
import { log } from './log'

interface SetDiscount {
  account_id: number;
  percent: number;
  currency: string;
}

export async function set(opts: SetDiscount) {

  log.info('discount.set', opts)

  let [discount, isNew] = await models.Discount.findOrCreate({
    where: {
      account_id: opts.account_id,
      currency: opts.currency
    },
    defaults: {
      account_id: opts.account_id,
      currency: opts.currency,
      percent: opts.percent
    }
  })

  if (!isNew) {

    discount.percent = opts.percent

    await discount.save()

  }

  return discount

}

