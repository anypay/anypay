#!/usr/bin/env ts-node

require('dotenv').config();

import * as Sequelize from 'sequelize';

import * as models from '../../../lib/models';

import {validateAddress} from '../';

(async function() {

  let accounts = await models.Account.findAll({
    where: {
      bitcoin_cash_address: {
        [Sequelize.Op.ne]: null
      }
    }
  });

  console.log(accounts);

  accounts.forEach(async account => {

    account.bitcoin_cash_address = await validateAddress(account.bitcoin_cash_address);

    await account.save();

    console.log('updated account', account.toJSON());

  });

})();

