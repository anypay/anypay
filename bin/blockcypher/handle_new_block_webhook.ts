

require('dotenv').config()

import { models } from '../../lib';

import { confirmTransactionsFromBlockWebhook } from "../../lib/blockcypher"

async function main() {

  const id = parseInt(process.argv[2])

  const record = await models.Event.findOne({
    where: { id }
  })

  console.log('webhook', record.payload)

  const result = await confirmTransactionsFromBlockWebhook(record.payload)

  console.log('result', result)
}

main()
