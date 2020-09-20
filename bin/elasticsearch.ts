#!/usr/bin/env ts-node

import * as program from 'commander'

import { Op } from 'sequelize'

import { elasticsearch } from '../lib/elasticsearch'

import { models } from '../lib'

program
  .command('search <query>')
  .action(async (query) => {

    let result = await elasticsearch.search({
      index: 'accounts',
      type: 'account',
      body: {
        query: {
          match: { business_name: `.+${query}.+` }
        }
      } 
    })

    console.log(result)
    result.hits.hits.forEach(hit => {
      console.log(hit)
    })

  })

// index all accounts by business name
program
  .command('index')
  .action(async () => {

    /*
    await elasticsearch.indices.create({
      index: 'accounts'
    })
     */

    let accounts = await models.Account.findAll({
      where: {
        business_name: {
          [Op.ne]: null
        }
      }
    })

    for (let account of accounts) {
      await elasticsearch.index({
        index: 'accounts',
        id: account.id,
        type: 'account',
        body: {
          business_name: account.business_name
        }
      })

      console.log("indexed", account.business_name)
    }

    process.exit(0)

  })



program.parse(process.argv)
