#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import { models } from '../lib/models'
import * as stub from '../lib/stub'

import { Op } from 'sequelize'

program
  .command('update-unset')
  .action(async () => {

    let accounts = await models.Account.findAll({ where: {
      stub: {
        [Op.eq]: null
      }
    }})

    for (let account of accounts) {

      await stub.updateAccount(account, models.Account)

    }

  })

program.parse(process.argv)
