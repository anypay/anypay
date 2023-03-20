
require('dotenv').config()

import { deleteNewBlockWebhook } from "../../lib/blockcypher"

async function main() {

    const result = await deleteNewBlockWebhook()

    console.log('result', result)
}

main()
