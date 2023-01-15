

require('dotenv').config()

import { confirmTransactionsFromBlock } from "../../lib/blockcypher"

async function main() {

  const blockHash = process.argv[2]

  const result = await confirmTransactionsFromBlock(blockHash)

  console.log('result', result)
}

main()
