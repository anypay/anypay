#!/usr/bin/env ts-node

require('dotenv').config();

const {Presenter} = require('yayson')({adapter: 'sequelize'})

var program = require('commander');

import { models, log, accounts } from '../lib';

import * as JsonApiSerializer from '../lib/serializers/jsonapi';

program
  .command('create <email> <password>')
  .action(async (email, password) => {

    let merchant = await accounts.create(email, password)

    log.info('merchant.created', merchant.toJSON());

  });

program
  .command('withambassador <email>')
  .action(async (email) => {

    let result = await models.Account.findOne({

      where: {
        email
      },

      include: [{
        model: models.Ambassador,
        as: 'ambassador'
      }]

    })

    let json = JsonApiSerializer.serializeMerchant(result);

    console.log(json);

  });


program
  .command('verify <merchant_email>')
  .action(async (email) => {

    log.info('verify merchant', email);

    let account = await models.Account.findOne({ where: { email }});

    let merchant = await models.DashBackMerchant.create({

      account_id: account.id

    });

    console.log(merchant.toJSON());

    process.exit(0);

  });

program
  .command('creategroup <name> [account_email]')
  .action(async (name, email = 'steven@anypayinc.com') => {

    let account = await models.Account.findOne({ where: { email }});    

    let [group, created] = await models.MerchantGroup.findOrCreate({

      where: { name },
      
      defaults:  {

        name,

        account_id: account.id
      }

    });

    if (created) {

      log.info('merchant_group.created', group.toJSON()); 

    } else {

      log.info('merchant_group.exists', group.toJSON());

    }

  });

program
  .command('addtogroup <merchant_email> <group_name> [account_email]')
  .action(async (merchantEmail, groupName, email = 'steven@anypayinc.com') => {

    let account = await models.Account.findOne({ where: { email }});    

    let [group, created] = await models.MerchantGroup.findOrCreate({

      where: { name: groupName },
      
      defaults:  {

        name: groupName,

        account_id: account.id
      }

    });

    if (created) {

      log.info('merchant_group.created', group.toJSON()); 

    } else {

      log.info('merchant_group.exists', group.toJSON());

    }

    let merchant = await models.Account.findOne({ where: {

      email: merchantEmail

    }});

    if (!merchant) {

      log.error(`no merchant found for email ${merchantEmail}`);

      process.exit(1);

    }

    let [member, memberCreated] = await models.MerchantGroupMember.findOrCreate({

      where: {

        account_id: merchant.id,

        merchant_group_id: group.id

      },

      defaults: {

        account_id: merchant.id,

        merchant_group_id: group.id

      }

    });

    if (memberCreated) {

      log.info('merchant_group_member.added', member.toJSON()); 

    } else {

      log.info('merchant_group_member.exists', member.toJSON());

    }

  });

program
  .command('listgroupmembers <name>')
  .action(async (name) => {

    let merchantGroup = await models.MerchantGroup.findOne({ where: {

      name

    }});

    if (!merchantGroup) {

      log.error(`no member group found with name ${name}`);

      process.exit(1);

    }

    let groupMembers = await models.MerchantGroupMember.findAll({ where: {

      merchant_group_id: merchantGroup.id

    }});

    log.info(`${groupMembers.length} merchants in the group ${name}`);

    groupMembers.forEach(async (member) => {

      let account = await models.Account.findOne({ where: {

        id: member.account_id

      }});

      log.info(`[ ${account.email} ]`);

    });


  });

program
  .command('listgroups')
  .action(async () => {

    let merchantGroups = await models.MerchantGroup.findAll();

    merchantGroups.forEach(group => {

      let members = models.MerchantGroupMember.findAll({ where: {

        merchant_group_id: group.id

      }});

      log.info(`${group.name} | ${members.length || 0} members`);

    });

  });


program.parse(process.argv);

