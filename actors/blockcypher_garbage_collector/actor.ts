
import { models, log } from '../../lib';

import * as cron from 'node-cron';

import * as moment from 'moment';

import * as  http from "superagent";

const token = process.env.BLOCKCYPHER_TOKEN;

import { Op } from 'sequelize';

async function getAllExpiredBlockcypherPaymentForwards() {

  return models.BlockcypherPaymentForward.findAll({

    where: {

      deleted: false,

      createdAt: {

        [Op.lt]: moment().subtract(1, 'day').toDate()

      }

    }

  });

}

async function start() {

  cron.schedule('* * * * *', async () => {

    let expired = await getAllExpiredBlockcypherPaymentForwards();

    log.info(`${expired.length} blockcypher payment forwards expired`);

    for (let i=0; i < expired.length; i++) {

      let forward = expired[i];

      await deletePaymentForward(forward.payment_id);

      forward.deleted = true; 

      await forward.save();

      log.info(`blockcypher.forward.deleted`, forward.payment_id);

    }

  });

}

async function deletePaymentForward(id) {
  await http
    .delete(
      `https://api.blockcypher.com/v1/dash/main/forwards/${id}?token=${token}`
    )
}

export {
	start
}

if (require.main === module) {

  start();

}

