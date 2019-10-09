
import * as Sequelize from 'sequelize';

import { models } from '../models';

export async function getInvoiceRange(startUid:string, endUid:string, where:any={}) {

  let start = await models.Invoice.findOne({ where: { uid: startUid }});
  let end = await models.Invoice.findOne({ where: { uid: endUid }});

  where['id'] = {
    [Sequelize.Op.gte]: start.id,
    [Sequelize.Op.lte]: end.id
  }

  console.log('where', where);

  return models.Invoice.findAll({ where });

}
