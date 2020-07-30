
import { models } from './models';

export async function getDiscount(account_id: number, coin: string = '*') {

  let discount = await models.Discount.findOne({ where: { account_id, coin }})

  if (!discount) {

    discount = await models.Discount.create({ account_id });

  }

  return discount;

}

export async function setDiscount(account_id: number, percent: number, coin: string = '*') {

  let discount = await models.Discount.findOne({ where: { account_id, coin }})

  if (discount) {

    discount.percent = percent;

    await discount.save();

  } else {

    discount = await models.Discount.create({
      account_id,
      percent,
      coin
    })

  }

  return discount;

}


